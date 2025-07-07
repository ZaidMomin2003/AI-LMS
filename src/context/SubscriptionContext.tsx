
'use client';

import type { UserSubscription } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  setSubscription: (subscription: UserSubscription | null) => void;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscriptionState] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        setLoading(true);
        try {
            const userData = await getUserDoc(user.uid);

            if (userData === null) {
              // This case handles offline errors or when the user doc doesn't exist yet.
              // We load a default plan to prevent UI blocking but AVOID writing back,
              // which would fail if offline.
              console.warn("Could not fetch user data, assuming default subscription for this session.");
              const defaultSub = { planName: 'Hobby', status: 'active' } as UserSubscription;
              setSubscriptionState(defaultSub);
            } else if (userData.subscription) {
                // User and subscription plan exist.
                setSubscriptionState(userData.subscription);
            } else {
                // User document exists but no subscription record. This means we can safely write one.
                const defaultSub = { planName: 'Hobby', status: 'active' } as UserSubscription;
                setSubscriptionState(defaultSub);
                await updateUserDoc(user.uid, { subscription: defaultSub });
            }
        } catch (error) {
            console.error("Failed to process subscription:", error);
            // Fallback to a default plan in case of any unexpected error.
            const defaultSub = { planName: 'Hobby', status: 'active' } as UserSubscription;
            setSubscriptionState(defaultSub);
        } finally {
            setLoading(false);
        }
      } else {
        setSubscriptionState(null);
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const setSubscription = async (data: UserSubscription | null) => {
    setSubscriptionState(data); // Optimistic update
    if (!user) return;
    await updateUserDoc(user.uid, { subscription: data });
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, setSubscription, loading }}>
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
