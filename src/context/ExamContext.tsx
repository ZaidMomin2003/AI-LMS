'use client';

import type { ExamDetails } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ExamContextType {
  exam: ExamDetails | null;
  addExam: (exam: ExamDetails) => void;
  clearExam: () => void;
  timeLeft: TimeLeft | null;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const EXAM_STORAGE_KEY_PREFIX = 'scholarai_exam_details';

export const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [storageKey, setStorageKey] = useState('');

  useEffect(() => {
    if (user) {
        setStorageKey(`${EXAM_STORAGE_KEY_PREFIX}_${user.uid}`);
    } else {
        setStorageKey('');
    }
  }, [user]);

  useEffect(() => {
    if (storageKey) {
        try {
          const storedExam = localStorage.getItem(storageKey);
          if (storedExam) {
            setExam(JSON.parse(storedExam));
          } else {
            setExam(null);
          }
        } catch (error) {
          console.error('Failed to load exam details from localStorage', error);
          setExam(null);
        }
    } else {
        setExam(null);
    }
    setIsInitialized(true);
  }, [storageKey]);
  
  useEffect(() => {
    if (isInitialized && storageKey) {
      try {
        if (exam) {
            localStorage.setItem(storageKey, JSON.stringify(exam));
        } else {
            localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Failed to save exam details to localStorage', error);
      }
    }
  }, [exam, isInitialized, storageKey]);

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

  const addExam = (newExam: ExamDetails) => {
    setExam(newExam);
  };

  const clearExam = () => {
    setExam(null);
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
