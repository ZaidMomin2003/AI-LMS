
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { getUserDoc, updateUserDoc } from '@/app/dashboard/profile/actions';

export interface ProfileData {
  phoneNumber?: string;
  country?: string;
  grade?: string;
  referralSource?: string;
  captureCount?: number;
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
    const fetchProfile = async () => {
      if (user && isFirebaseEnabled) {
        setLoading(true);
        try {
            const userData = await getUserDoc(user.uid);
            const profileData = userData?.profile || {};
            if (typeof profileData.captureCount !== 'number') {
                profileData.captureCount = 0;
            }
            setProfile(profileData);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setProfile({ captureCount: 0 });
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

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    if (!user || !isFirebaseEnabled) return;

    setProfile(prevProfile => {
        const newProfile = { ...prevProfile, ...data };

        // Special handling for captureCount increment
        if (data.captureCount === -1) {
            newProfile.captureCount = (prevProfile?.captureCount || 0) + 1;
        }

        updateUserDoc(user.uid, { profile: newProfile });
        return newProfile;
    });
}, [user]);


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
