
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { useTopic } from './TopicContext';
import { useRoadmap } from './RoadmapContext';
import { usePomodoro } from './PomodoroContext';
import { useProfile } from './ProfileContext';
import { listenToUserDoc, updateUserDoc } from '@/services/firestore';

interface Subscription {
  plan: string;
  status: 'active' | 'inactive';
  expiryDate: string;
}

type Feature = 'topic' | 'roadmap' | 'pomodoro' | 'capture' | 'wisdomGpt' | 'receiveTopic';

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  canUseFeature: (feature: Feature) => boolean;
  incrementReceivedTopics: () => Promise<void>;
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
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  
  useEffect(() => {
    if (user && isFirebaseEnabled) {
      setLoading(true);
      const unsubscribe = listenToUserDoc(user, (data) => {
          let sub = data?.subscription || null;
          // Check for expiry
          if (sub && new Date(sub.expiryDate) < new Date()) {
            sub.status = 'inactive';
          }
          setSubscription(sub);
          setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const incrementReceivedTopics = async () => {
    if (!user) return;
    const currentCount = profile?.receivedTopicsCount || 0;
    await updateProfile({ receivedTopicsCount: currentCount + 1 });
  };

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
        return topics.length < 3;
      case 'roadmap':
        // Allow if there is no roadmap data at all
        return !roadmap || roadmap.plan.length === 0;
      case 'pomodoro':
        return pomodoroHistory.length < 3;
      case 'capture':
        return (profile?.captureCount || 0) < 3;
      case 'wisdomGpt':
        return false; // Only available on Pro plan
      case 'receiveTopic':
        return (profile?.receivedTopicsCount || 0) < 3;
      default:
        return false;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, canUseFeature, incrementReceivedTopics }}>
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
