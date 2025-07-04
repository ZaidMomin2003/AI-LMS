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
          setTopics([]);
        }
      } catch (error) {
        console.error("Failed to load topics from localStorage", error);
        setTopics([]);
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
