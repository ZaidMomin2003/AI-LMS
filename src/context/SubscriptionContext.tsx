'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';
import { useTopic } from './TopicContext';
import { useRoadmap } from './RoadmapContext';
import { usePomodoro } from './PomodoroContext';
import { useProfile } from './ProfileContext';

interface Subscription {
  plan: string;
  status: 'active' | 'inactive';
  expiryDate: string;
}

type Feature = 'topic' | 'roadmap' | 'pomodoro' | 'capture' | 'wisdomGpt';

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  canUseFeature: (feature: Feature) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Hooks for usage counts
  const { topics, dataLoading: topicsLoading } = useTopic();
  const { roadmap, loading: roadmapLoading } = useRoadmap();
  const { pomodoroHistory, loading: pomodoroLoading } = usePomodoro();
  const { profile, loading: profileLoading } = useProfile();
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user && isFirebaseEnabled) {
        setLoading(true);
        try {
          const userData = await getUserDoc(user.uid);
          let sub = userData?.subscription || null;

          // Check for expiry
          if (sub && new Date(sub.expiryDate) < new Date()) {
            sub.status = 'inactive';
          }
          
          setSubscription(sub);
        } catch (error) {
          console.error("Failed to fetch subscription:", error);
          setSubscription(null);
        } finally {
          setLoading(false);
        }
      } else {
        setSubscription(null);
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const canUseFeature = (feature: Feature): boolean => {
    if (loading || topicsLoading || roadmapLoading || pomodoroLoading || profileLoading) {
      return false; // Don't allow usage while loading to prevent race conditions
    }

    if (subscription?.status === 'active') {
      return true; // Pro users have unlimited access
    }

    // Free plan logic
    switch (feature) {
      case 'topic':
        return topics.length < 1;
      case 'roadmap':
        return !roadmap;
      case 'pomodoro':
        return pomodoroHistory.length < 1;
      case 'capture':
        return (profile?.captureCount || 0) < 1;
      case 'wisdomGpt':
        return false; // Never allowed on free plan
      default:
        return false;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, canUseFeature }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
