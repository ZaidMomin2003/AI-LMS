
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';

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
      if (user && isFirebaseEnabled) {
        setLoading(true);
        try {
            const userData = await getUserDoc(user.uid);
            setProfile(userData?.profile || null);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const updateProfile = async (data: ProfileData) => {
    if (!user || !isFirebaseEnabled) return;
    const newProfile = { ...profile, ...data };
    setProfile(newProfile); // Optimistic update
    await updateUserDoc(user.uid, { profile: newProfile });
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
