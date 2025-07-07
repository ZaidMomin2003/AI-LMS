'use client';

import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';

interface RoadmapContextType {
    roadmap: GenerateRoadmapOutput | null;
    setRoadmap: (roadmap: GenerateRoadmapOutput | null) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [roadmap, setRoadmapState] = useState<GenerateRoadmapOutput | null>(null);

    useEffect(() => {
        const fetchRoadmap = async () => {
            if (user) {
                const userData = await getUserDoc(user.uid);
                setRoadmapState(userData?.roadmap || null);
            } else {
                setRoadmapState(null);
            }
        };
        fetchRoadmap();
    }, [user]);

    const setRoadmap = async (newRoadmap: GenerateRoadmapOutput | null) => {
        if (!user) return;
        await updateUserDoc(user.uid, { roadmap: newRoadmap });
        setRoadmapState(newRoadmap);
    };

    return (
        <RoadmapContext.Provider value={{ roadmap, setRoadmap }}>
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
