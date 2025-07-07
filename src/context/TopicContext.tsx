'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic } from '@/types';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';

interface TopicContextType {
  topics: Topic[];
  addTopic: (topic: Topic) => Promise<void>;
  getTopicById: (id: string) => Topic | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataLoading: boolean;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false); // For AI generation
  const [dataLoading, setDataLoading] = useState(true); // For initial data fetch

  useEffect(() => {
    const fetchTopics = async () => {
      if (user) {
        setDataLoading(true);
        const userData = await getUserDoc(user.uid);
        if (userData?.topics) {
          // Firestore Timestamps need to be converted to JS Dates
          const parsedTopics = userData.topics.map((t: any) => ({
              ...t,
              createdAt: t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt)
          }));
          setTopics(parsedTopics);
        } else {
          setTopics([]);
        }
        setDataLoading(false);
      } else {
        setTopics([]);
        setDataLoading(false);
      }
    };
    fetchTopics();
  }, [user]);

  const addTopic = async (topic: Topic) => {
    if (!user) return;
    const newTopics = [topic, ...topics];
    setTopics(newTopics); // Optimistic update
    await updateUserDoc(user.uid, { topics: newTopics });
  };

  const getTopicById = (id: string) => {
    return topics.find((topic) => topic.id === id);
  };

  return (
    <TopicContext.Provider value={{ topics, addTopic, getTopicById, loading, setLoading, dataLoading }}>
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
