
'use client';

import type { UserSubscription } from '@/types';
import React, from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  setSubscription: (subscription: UserSubscription | null) => void;
  loading: boolean;
}

const SubscriptionContext = React.createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscriptionState] = React.useState<UserSubscription | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // If firebase is not configured, or if there's no user, set default and stop loading.
    if (!isFirebaseEnabled || !user || !db) {
      setSubscriptionState({ planName: 'Hobby', status: 'active' });
      setLoading(false);
      return;
    }

    setLoading(true);

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen for real-time updates to the user document
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.subscription) {
          setSubscriptionState(userData.subscription);
        } else {
          // If subscription field doesn't exist, create it with Hobby plan
          const defaultSub: UserSubscription = { planName: 'Hobby', status: 'active' };
          await updateUserDoc(user.uid, { subscription: defaultSub });
          setSubscriptionState(defaultSub);
        }
      } else {
        // If user document doesn't exist, create it with Hobby plan
        const defaultSub: UserSubscription = { planName: 'Hobby', status: 'active' };
        await updateUserDoc(user.uid, { subscription: defaultSub });
        setSubscriptionState(defaultSub);
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to listen to subscription updates:", error);
      // Fallback to a default state on error
      setSubscriptionState({ planName: 'Hobby', status: 'active' });
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();

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
  const context = React.useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
