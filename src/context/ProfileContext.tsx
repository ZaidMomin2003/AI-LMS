'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface ProfileData {
  phoneNumber?: string;
  country?: string;
  grade?: string;
  referralSource?: string;
}

interface ProfileContextType {
  profile: ProfileData | null;
  updateProfile: (data: ProfileData) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY_PREFIX = 'scholarai_profile_data';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [storageKey, setStorageKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setStorageKey(`${PROFILE_STORAGE_KEY_PREFIX}_${user.uid}`);
    } else {
      setStorageKey('');
    }
  }, [user]);

  useEffect(() => {
    if (storageKey) {
      try {
        const storedProfile = localStorage.getItem(storageKey);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to load profile from localStorage', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    } else {
        setProfile(null);
        setLoading(false);
    }
  }, [storageKey]);

  const updateProfile = (data: ProfileData) => {
    const newProfile = { ...profile, ...data };
    setProfile(newProfile);
    if (storageKey) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(newProfile));
        } catch (error) {
            console.error('Failed to save profile to localStorage', error);
        }
    }
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
