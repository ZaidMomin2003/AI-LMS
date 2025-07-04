'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic } from '@/types';
import { useAuth } from './AuthContext';

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
      explanation: 'Superposition is a fundamental principle of quantum mechanics. It states that, much like waves in classical physics, any two (or more) quantum states can be added together ("superposed") and the result will be another valid quantum state.'
    },
  ],
};

const TopicContext = createContext<TopicContextType | undefined>(undefined);

const TOPICS_STORAGE_KEY_PREFIX = 'scholarai_topics';

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [storageKey, setStorageKey] = useState('');

  useEffect(() => {
    if (user) {
      setStorageKey(`${TOPICS_STORAGE_KEY_PREFIX}_${user.uid}`);
    } else {
      setStorageKey('');
    }
  }, [user]);

  useEffect(() => {
    if (storageKey) {
      try {
        const storedTopics = localStorage.getItem(storageKey);
        if (storedTopics) {
          const parsedTopics = JSON.parse(storedTopics).map((t: any) => ({
              ...t,
              createdAt: new Date(t.createdAt)
          }));
          setTopics(parsedTopics);
        } else {
          setTopics([sampleTopic]);
        }
      } catch (error) {
        console.error("Failed to load topics from localStorage", error);
        setTopics([sampleTopic]);
      }
    } else {
      setTopics([]);
    }
    setIsInitialized(true);
  }, [storageKey]);

  useEffect(() => {
    if (isInitialized && storageKey) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(topics));
        } catch (error) {
            console.error("Failed to save topics to localStorage", error);
        }
    }
  }, [topics, isInitialized, storageKey]);

  const addTopic = (topic: Topic) => {
    setTopics((prevTopics) => [topic, ...prevTopics]);
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
