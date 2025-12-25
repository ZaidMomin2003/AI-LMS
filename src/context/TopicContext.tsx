
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic } from '@/types';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import type { Timestamp } from 'firebase/firestore';

interface TopicContextType {
  topics: Topic[];
  addTopic: (topic: Topic) => Promise<void>;
  receiveSharedTopic: (topic: Omit<Topic, 'id'>) => Promise<Topic | null>;
  getTopicById: (id: string) => Topic | undefined;
  getTopicForOwner: (topicId: string, ownerId: string) => Promise<Omit<Topic, 'id'> | null>;
  toggleBookmark: (topicId: string) => Promise<void>;
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
      if (user && isFirebaseEnabled) {
        setDataLoading(true);
        try {
            const userData = await getUserDoc(user.uid);
            if (userData?.topics) {
              const parsedTopics = userData.topics.map((t: any) => ({
                  ...t,
                  createdAt: t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt)
              }));
              setTopics(parsedTopics.sort((a: Topic, b: Topic) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
              setTopics([]);
            }
        } catch (error) {
            console.error("Failed to fetch topics:", error);
            setTopics([]);
        } finally {
            setDataLoading(false);
        }
      } else {
        setTopics([]);
        setDataLoading(false);
      }
    };
    fetchTopics();
  }, [user]);

  const addTopic = async (topic: Topic) => {
    if (!user || !isFirebaseEnabled) return;
    const newTopics = [topic, ...topics];
    // Don't optimistically update here to avoid flashing, wait for db write
    await updateUserDoc(user.uid, { topics: newTopics });
    setTopics(newTopics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const getTopicById = (id: string) => {
    return topics.find((topic) => topic.id === id);
  };
  
  const getTopicForOwner = async (topicId: string, ownerId: string) => {
    if (!isFirebaseEnabled) return null;
    const ownerData = await getUserDoc(ownerId);
    if (!ownerData || !ownerData.topics) return null;
    const foundTopic = ownerData.topics.find((t: Topic) => t.id === topicId);
    if (!foundTopic) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...topicData } = foundTopic;
    return topicData;
  };

  const receiveSharedTopic = async (topicData: Omit<Topic, 'id'>) => {
    if (!user || !isFirebaseEnabled) return null;
    const newTopic: Topic = {
        ...topicData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        isBookmarked: false, // Default for a received topic
    };
    const newTopics = [newTopic, ...topics];
    setTopics(newTopics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    await updateUserDoc(user.uid, { topics: newTopics });
    return newTopic;
  };

  const toggleBookmark = async (topicId: string) => {
    if (!user || !isFirebaseEnabled) return;
    const newTopics = topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, isBookmarked: !topic.isBookmarked } 
        : topic
    );
    setTopics(newTopics);
    await updateUserDoc(user.uid, { topics: newTopics });
  }

  return (
    <TopicContext.Provider value={{ topics, addTopic, getTopicById, getTopicForOwner, receiveSharedTopic, toggleBookmark, loading, setLoading, dataLoading }}>
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
