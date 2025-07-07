'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';

export interface ProfileData {
  phoneNumber?: string;
  country?: string;
  grade?: string;
  referralSource?: string;
}

interface ProfileContextType {
  profile: ProfileData | null;
  updateProfile: (data: ProfileData) => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const userData = await getUserDoc(user.uid);
        setProfile(userData?.profile || null);
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const updateProfile = async (data: ProfileData) => {
    if (!user) return;
    const newProfile = { ...profile, ...data };
    await updateUserDoc(user.uid, { profile: newProfile });
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
