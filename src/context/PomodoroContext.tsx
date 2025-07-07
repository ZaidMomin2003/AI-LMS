'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';

interface PomodoroContextType {
  pomodoroCount: number;
  incrementPomodoroCount: () => Promise<void>;
  loading: boolean;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPomodoroCount = async () => {
      if (user && isFirebaseEnabled) {
        setLoading(true);
        try {
          const userData = await getUserDoc(user.uid);
          setPomodoroCount(userData?.pomodoroCount || 0);
        } catch (error) {
          console.error("Failed to fetch pomodoro count:", error);
          setPomodoroCount(0);
        } finally {
          setLoading(false);
        }
      } else {
        setPomodoroCount(0);
        setLoading(false);
      }
    };
    fetchPomodoroCount();
  }, [user]);

  const incrementPomodoroCount = async () => {
    if (!user || !isFirebaseEnabled) return;
    const newCount = pomodoroCount + 1;
    setPomodoroCount(newCount); // Optimistic update
    await updateUserDoc(user.uid, { pomodoroCount: newCount });
  };

  return (
    <PomodoroContext.Provider value={{ pomodoroCount, incrementPomodoroCount, loading }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
