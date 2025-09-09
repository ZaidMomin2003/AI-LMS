
'use client';

import type { ExamDetails } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';
import type { Timestamp } from 'firebase/firestore';

interface ExamContextType {
  exam: ExamDetails | null;
  addExam: (exam: ExamDetails) => Promise<void>;
  clearExam: () => Promise<void>;
  timeLeft: TimeLeft | null;
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

  useEffect(() => {
    const fetchExam = async () => {
        if (user && isFirebaseEnabled) {
            try {
                const userData = await getUserDoc(user.uid);
                if (userData?.exam) {
                    const examData = userData.exam;
                    if (examData.date && typeof examData.date !== 'string') {
                        const dateTimestamp = examData.date as Timestamp;
                        examData.date = dateTimestamp.toDate().toISOString();
                    }
                    setExam(examData);
                } else {
                    setExam(null);
                }
            } catch (error) {
                console.error("Failed to fetch exam details:", error);
                setExam(null);
            }
        } else {
            setExam(null);
        }
    };
    fetchExam();
  }, [user]);

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
      }
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  const addExam = async (newExam: ExamDetails) => {
    if (!user || !isFirebaseEnabled) return;
    setExam(newExam); // Optimistic update
    const examToSave = {
        ...newExam,
        date: new Date(newExam.date),
    };
    await updateUserDoc(user.uid, { exam: examToSave });
  };

  const clearExam = async () => {
    if (!user || !isFirebaseEnabled) return;
    setExam(null); // Optimistic update
    await updateUserDoc(user.uid, { exam: null });
  };

  return (
    <ExamContext.Provider value={{ exam, addExam, clearExam, timeLeft }}>
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
