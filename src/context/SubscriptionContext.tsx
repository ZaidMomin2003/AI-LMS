
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
    // If there's no user, reset state and stop loading.
    if (!user) {
      setSubscriptionState(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchSubscription = async () => {
      // 1. Attempt to get user data. getUserDoc is designed to return null on failure, not crash.
      const userData = await getUserDoc(user.uid);
      
      if (!isMounted) return;

      // 2. Check if a subscription plan already exists in the fetched data.
      if (userData?.subscription) {
        setSubscriptionState(userData.subscription);
      } else {
        // 3. If no plan exists, set a default "Hobby" plan.
        const defaultSub: UserSubscription = { planName: 'Hobby', status: 'active' };
        setSubscriptionState(defaultSub);

        // 4. IMPORTANT: Only try to SAVE the default plan back to Firestore if we are NOT offline.
        // We know we are online if userData is not null (even if it's an empty object for a new user).
        if (userData !== null) {
          await updateUserDoc(user.uid, { subscription: defaultSub });
        }
      }

      setLoading(false);
    };

    fetchSubscription().catch(error => {
        // This is a fallback catch, though getUserDoc should prevent it.
        console.error("An unexpected error occurred in fetchSubscription:", error);
        if (isMounted) {
            setSubscriptionState({ planName: 'Hobby', status: 'active' });
            setLoading(false);
        }
    });

    return () => {
        isMounted = false;
    }

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
