'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { listenToUserDoc, updateUserDoc } from '@/services/firestore';

interface SubjectContextType {
  subjects: string[];
  addSubject: (subject: string) => Promise<void>;
  loading: boolean;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const SubjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isFirebaseEnabled) {
      setLoading(true);
      const unsubscribe = listenToUserDoc(user, (data) => {
          setSubjects(data?.subjects || []);
          setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setSubjects([]);
      setLoading(false);
    }
  }, [user]);

  const addSubject = async (newSubject: string) => {
    if (!user || !isFirebaseEnabled || subjects.includes(newSubject)) return;
    const newSubjects = [...subjects, newSubject].sort();
    setSubjects(newSubjects); // Optimistic update
    await updateUserDoc(user.uid, { subjects: newSubjects });
  };

  return (
    <SubjectContext.Provider value={{ subjects, addSubject, loading }}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
};
