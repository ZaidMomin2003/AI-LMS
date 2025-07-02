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

const TopicContext = createContext<TopicContextType | undefined>(undefined);

const TOPICS_STORAGE_KEY = 'scholarai_topics';

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (storedTopics) {
        const parsedTopics = JSON.parse(storedTopics).map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt)
        }));
        setTopics(parsedTopics);
      }
    } catch (error) {
      console.error("Failed to load topics from localStorage", error);
      setTopics([]);
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
