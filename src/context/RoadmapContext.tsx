
'use client';

import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/app/dashboard/roadmap/actions';
import { isFirebaseEnabled } from '@/lib/firebase';

interface RoadmapContextType {
    roadmap: GenerateRoadmapOutput | null;
    setRoadmap: (roadmap: GenerateRoadmapOutput | null) => void;
    loading: boolean;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [roadmap, setRoadmapState] = useState<GenerateRoadmapOutput | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            if (user && isFirebaseEnabled) {
                setLoading(true);
                try {
                    const userData = await getUserDoc(user.uid);
                    setRoadmapState(userData?.roadmap || null);
                } catch (error) {
                    console.error("Failed to fetch roadmap:", error);
                    setRoadmapState(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setRoadmapState(null);
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [user]);

    const setRoadmap = async (newRoadmap: GenerateRoadmapOutput | null) => {
        setRoadmapState(newRoadmap); // Optimistic update for UI responsiveness
        if (!user || !isFirebaseEnabled) return;
        await updateUserDoc(user.uid, { roadmap: newRoadmap });
    };

    return (
        <RoadmapContext.Provider value={{ roadmap, setRoadmap, loading }}>
            {children}
        </RoadmapContext.Provider>
    );
};

export const useRoadmap = () => {
    const context = useContext(RoadmapContext);
    if (context === undefined) {
        throw new Error('useRoadmap must be used within a RoadmapProvider');
    }
    return context;
};
