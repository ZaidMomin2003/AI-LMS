'use client';

import type { UserSubscription } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  setSubscription: (subscription: UserSubscription | null) => void;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const SUBSCRIPTION_STORAGE_KEY_PREFIX = 'scholarai_subscription';

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [storageKey, setStorageKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setStorageKey(`${SUBSCRIPTION_STORAGE_KEY_PREFIX}_${user.uid}`);
    } else {
      setStorageKey('');
    }
  }, [user]);

  useEffect(() => {
    if (storageKey) {
      try {
        const storedSubscription = localStorage.getItem(storageKey);
        if (storedSubscription) {
          setSubscription(JSON.parse(storedSubscription));
        } else {
          // Default to Hobby plan for new users
          setSubscription({ planName: 'Hobby', status: 'active' });
        }
      } catch (error) {
        console.error('Failed to load subscription from localStorage', error);
        setSubscription({ planName: 'Hobby', status: 'active' });
      } finally {
        setLoading(false);
      }
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [storageKey]);

  const updateSubscription = (data: UserSubscription | null) => {
    setSubscription(data);
    if (storageKey) {
        try {
            if (data) {
                localStorage.setItem(storageKey, JSON.stringify(data));
            } else {
                localStorage.removeItem(storageKey);
            }
        } catch (error) {
            console.error('Failed to save subscription to localStorage', error);
        }
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, setSubscription: updateSubscription, loading }}>
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
