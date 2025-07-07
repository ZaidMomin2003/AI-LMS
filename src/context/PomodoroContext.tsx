
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';
import type { PomodoroSession } from '@/types';

interface PomodoroContextType {
  pomodoroHistory: PomodoroSession[];
  addCompletedPomodoro: (session: { topic: string, sessions: number }) => Promise<void>;
  loading: boolean;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [pomodoroHistory, setPomodoroHistory] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPomodoroHistory = async () => {
      if (user && isFirebaseEnabled) {
        setLoading(true);
        try {
          const userData = await getUserDoc(user.uid);
          setPomodoroHistory(userData?.pomodoroHistory || []);
        } catch (error) {
          console.error("Failed to fetch pomodoro history:", error);
          setPomodoroHistory([]);
        } finally {
          setLoading(false);
        }
      } else {
        setPomodoroHistory([]);
        setLoading(false);
      }
    };
    fetchPomodoroHistory();
  }, [user]);

  const addCompletedPomodoro = async (session: { topic: string, sessions: number }) => {
    if (!user || !isFirebaseEnabled) return;
    const newSession: PomodoroSession = {
        ...session,
        completedAt: new Date().toISOString(),
    }
    const newHistory = [...pomodoroHistory, newSession];
    setPomodoroHistory(newHistory); // Optimistic update
    await updateUserDoc(user.uid, { pomodoroHistory: newHistory });
  };

  return (
    <PomodoroContext.Provider value={{ pomodoroHistory, addCompletedPomodoro, loading }}>
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
