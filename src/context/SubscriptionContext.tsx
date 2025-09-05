
'use client';

import type { UserSubscription } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';

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
    let isMounted = true;
    
    // If firebase is not configured, or if there's no user, set default and stop loading.
    if (!isFirebaseEnabled || !user) {
      setSubscriptionState(null); // No default subscription
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const fetchSubscription = async () => {
      const userData = await getUserDoc(user.uid);
      
      if (!isMounted) return;

      if (userData?.subscription) {
        setSubscriptionState(userData.subscription);
      } else {
        // In an invite-only system, a user should have a subscription upon creation.
        // If they don't, we can log it but shouldn't assign a default one.
        console.warn("User does not have a subscription object in Firestore.");
        setSubscriptionState(null);
      }

      setLoading(false);
    };

    fetchSubscription().catch(error => {
        console.error("An unexpected error occurred in fetchSubscription:", error);
        if (isMounted) {
            setSubscriptionState(null);
            setLoading(false);
        }
    });

    return () => {
        isMounted = false;
    }

  }, [user]);

  const setSubscription = async (data: UserSubscription | null) => {
    setSubscriptionState(data); // Optimistic update
    if (!user || !isFirebaseEnabled) return;
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
