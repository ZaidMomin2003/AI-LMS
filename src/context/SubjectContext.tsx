'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { getUserDoc, updateUserDoc } from '@/app/dashboard/subjects/actions';

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
    const fetchSubjects = async () => {
      if (user && isFirebaseEnabled) {
        setLoading(true);
        try {
          const userData = await getUserDoc(user.uid);
          setSubjects(userData?.subjects || []);
        } catch (error) {
          console.error("Failed to fetch subjects:", error);
          setSubjects([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSubjects([]);
        setLoading(false);
      }
    };
    fetchSubjects();
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
