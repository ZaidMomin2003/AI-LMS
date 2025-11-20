
'use client';

import type { ExamDetails } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/app/dashboard/exam/actions';
import { isFirebaseEnabled } from '@/lib/firebase';

interface ExamContextType {
  exam: ExamDetails | null;
  addExam: (exam: ExamDetails) => Promise<void>;
  clearExam: () => Promise<void>;
  timeLeft: TimeLeft | null;
  loading: boolean;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
        if (user && isFirebaseEnabled) {
            setLoading(true);
            try {
                const userData = await getUserDoc(user.uid);
                setExam(userData?.exam || null);
            } catch (error) {
                console.error("Failed to fetch exam details:", error);
                setExam(null);
            } finally {
                setLoading(false);
            }
        } else {
            setExam(null);
            setLoading(false);
        }
    };
    fetchExam();
  }, [user]);

  const clearExam = async () => {
    if (!user || !isFirebaseEnabled) return;
    setExam(null); // Optimistic update
    await updateUserDoc(user.uid, { exam: null });
  };

  useEffect(() => {
    if (!exam?.date) {
        setTimeLeft(null);
        return;
    };

    const calculateTimeLeft = () => {
      const difference = +new Date(exam.date) - +new Date();
      if (difference > 0) {
          setTimeLeft({
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60)
          });
      } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearExam();
      }
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  const addExam = async (newExam: ExamDetails) => {
    if (!user || !isFirebaseEnabled) return;
    await updateUserDoc(user.uid, { exam: newExam });
    setExam(newExam); // Update state after DB call
  };

  return (
    <ExamContext.Provider value={{ exam, addExam, clearExam, timeLeft, loading }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
