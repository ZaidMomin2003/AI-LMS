'use client';

import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled } from '@/lib/firebase';
import { listenToUserDoc, updateUserDoc } from '@/services/firestore';

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
        if (user && isFirebaseEnabled) {
            setLoading(true);
            const unsubscribe = listenToUserDoc(user, (data) => {
                setRoadmapState(data?.roadmap || null);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setRoadmapState(null);
            setLoading(false);
        }
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
