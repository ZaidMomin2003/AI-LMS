'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic } from '@/types';

interface TopicContextType {
  topics: Topic[];
  addTopic: (topic: Topic) => void;
  getTopicById: (id: string) => Topic | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const sampleTopic: Topic = {
  id: 'sample-topic-1',
  title: 'Demo: Quantum Physics',
  createdAt: new Date(),
  notes: `# Introduction to Quantum Physics

Quantum physics is the study of matter and energy at the most fundamental level. It aims to uncover the properties and behaviors of the very building blocks of nature.

## Key Concepts

### Wave-Particle Duality
One of the most bizarre and foundational concepts is **wave-particle duality**. This principle states that particles like electrons can exhibit characteristics of both waves (like diffraction) and particles (like having a specific location).

### Superposition
Another key idea is **superposition**. This means a quantum system can be in multiple states at the same time. For example, an electron can be in multiple locations at once until it is measured.

### Quantum Entanglement
**Quantum entanglement** is a phenomenon where two or more quantum particles are linked in such a way that their fates are intertwined, no matter how far apart they are. Measuring a property of one particle instantly influences the other. This is what Einstein famously called "spooky action at a distance."`,
  keyTerms: [
    {
      term: 'wave-particle duality',
      definition:
        'The concept in quantum mechanics that every particle or quantum entity may be described as either a particle or a wave.',
    },
    {
      term: 'superposition',
      definition:
        'The principle that a quantum system can exist in multiple states or locations at once, which collapses into a single state upon measurement.',
    },
    {
      term: 'Quantum entanglement',
      definition:
        'A physical phenomenon that occurs when a pair or group of particles is generated in such a way that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance.',
    },
  ],
  flashcards: [
    {
      term: 'Quantum',
      definition: 'The minimum amount of any physical entity involved in an interaction.',
    },
    {
      term: 'Wave-particle duality',
      definition: 'The concept that particles can exhibit both wave and particle properties.',
    },
  ],
  quiz: [
    {
      question: 'What is superposition?',
      options: [
        'A type of particle',
        'A state of being in multiple places at once',
        'A measurement technique',
        'A form of energy',
      ],
      answer: 'A state of being in multiple places at once',
    },
  ],
};

const TopicContext = createContext<TopicContextType | undefined>(undefined);

const TOPICS_STORAGE_KEY = 'scholarai_topics';

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
      let initialTopics: Topic[] = [];
      if (storedTopics) {
        initialTopics = JSON.parse(storedTopics).map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt)
        }));
      }
      
      const hasSampleTopic = initialTopics.some(t => t.id === sampleTopic.id);
      if (!hasSampleTopic) {
        setTopics([sampleTopic, ...initialTopics]);
      } else {
        setTopics(initialTopics);
      }

    } catch (error) {
      console.error("Failed to load topics from localStorage", error);
      setTopics([sampleTopic]);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
        try {
            localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
        } catch (error) {
            console.error("Failed to save topics to localStorage", error);
        }
    }
  }, [topics, isInitialized]);

  const addTopic = (topic: Topic) => {
    setTopics((prevTopics) => {
      // Prevent duplicate sample topic
      const filteredPrevTopics = prevTopics.filter(t => t.id !== sampleTopic.id);
      const newTopicList = [topic, ...filteredPrevTopics];
      if (!newTopicList.some(t => t.id === sampleTopic.id)) {
        return [sampleTopic, ...newTopicList];
      }
      return newTopicList;
    });
  };

  const getTopicById = (id: string) => {
    return topics.find((topic) => topic.id === id);
  };

  return (
    <TopicContext.Provider value={{ topics, addTopic, getTopicById, loading, setLoading }}>
      {children}
    </TopicContext.Provider>
  );
};

export const useTopic = () => {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('useTopic must be used within a TopicProvider');
  }
  return context;
};
