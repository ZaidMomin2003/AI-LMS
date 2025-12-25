
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { listenToUserDoc, updateUserDoc } from '@/services/firestore';

export interface OnboardingProfileData {
  name?: string;
  goal?: string;
  challenge?: string;
  firstMove?: string;
  examEve?: string;
  studySession?: string;
  superpower?: string;
  achillesHeel?: string;
  materialPref?: string;
}


export interface ProfileData extends OnboardingProfileData {
  phoneNumber?: string;
  country?: string;
  grade?: string;
  referralSource?: string;
  captureCount?: number;
  receivedTopicsCount?: number;
}

interface ProfileContextType {
  profile: ProfileData | null;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isFirebaseEnabled) {
      setLoading(true);
      const unsubscribe = listenToUserDoc(user, (data) => {
          const profileData = data?.profile || {};
          if (typeof profileData.captureCount !== 'number') {
              profileData.captureCount = 0;
          }
          if (typeof profileData.receivedTopicsCount !== 'number') {
              profileData.receivedTopicsCount = 0;
          }
          setProfile(profileData);
          setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    if (!user || !isFirebaseEnabled) return;

    const currentProfile = profile || {};
    let newProfileData: ProfileData = { ...currentProfile, ...data };

    if (data.captureCount === -1) {
        newProfileData.captureCount = (currentProfile?.captureCount || 0) + 1;
    }
    
    // Clear the field to allow re-onboarding
    if (data.referralSource === '') {
        newProfileData.referralSource = '';
    }

    // Perform the database update
    await updateUserDoc(user.uid, { profile: newProfileData });

    // Then, update the local state
    setProfile(newProfileData);
}, [user, profile]);


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
