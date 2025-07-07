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
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        setLoading(true);
        const userData = await getUserDoc(user.uid);
        if (userData?.subscription) {
            setSubscription(userData.subscription);
        } else {
            // Default to Hobby plan for new users
            const defaultSub = { planName: 'Hobby', status: 'active' } as UserSubscription;
            setSubscription(defaultSub);
            await updateUserDoc(user.uid, { subscription: defaultSub });
        }
        setLoading(false);
      } else {
        setSubscription(null);
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const updateSubscription = async (data: UserSubscription | null) => {
    if (!user) return;
    setSubscription(data);
    await updateUserDoc(user.uid, { subscription: data });
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
