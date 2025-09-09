
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Topic } from '@/types';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';
import type { Timestamp } from 'firebase/firestore';

interface TopicContextType {
  topics: Topic[];
  addTopic: (topic: Topic) => Promise<void>;
  getTopicById: (id: string) => Topic | undefined;
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
              const parsedTopics = userData.topics.map((t: any) => {
                  const createdAtTimestamp = t.createdAt as Timestamp;
                  return {
                      ...t,
                      createdAt: createdAtTimestamp?.toDate ? createdAtTimestamp.toDate().toISOString() : new Date(t.createdAt).toISOString()
                  };
              });
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
    // Ensure the new topic's createdAt is a string before adding to state
    const topicWithStringDate = {
      ...topic,
      createdAt: new Date(topic.createdAt).toISOString(),
    };
    const newTopics = [topicWithStringDate, ...topics];
    setTopics(newTopics); // Optimistic update
    
    // When saving to Firestore, convert strings back to Date objects
    const topicsToSave = newTopics.map(t => ({...t, createdAt: new Date(t.createdAt)}));
    await updateUserDoc(user.uid, { topics: topicsToSave });
  };

  const getTopicById = (id: string) => {
    return topics.find((topic) => topic.id === id);
  };
  
  const toggleBookmark = async (topicId: string) => {
    if (!user || !isFirebaseEnabled) return;
    const newTopics = topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, isBookmarked: !topic.isBookmarked } 
        : topic
    );
    setTopics(newTopics);
    const topicsToSave = newTopics.map(t => ({...t, createdAt: new Date(t.createdAt)}));
    await updateUserDoc(user.uid, { topics: topicsToSave });
  }

  return (
    <TopicContext.Provider value={{ topics, addTopic, getTopicById, toggleBookmark, loading, setLoading, dataLoading }}>
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
