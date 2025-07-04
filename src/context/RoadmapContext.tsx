'use client';

import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface RoadmapContextType {
    roadmap: GenerateRoadmapOutput | null;
    setRoadmap: (roadmap: GenerateRoadmapOutput | null) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

const ROADMAP_STORAGE_KEY = 'scholarai_roadmap';

export const RoadmapProvider = ({ children }: { children: React.ReactNode }) => {
    const [roadmap, setRoadmap] = useState<GenerateRoadmapOutput | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
            if (storedRoadmap) {
                setRoadmap(JSON.parse(storedRoadmap));
            }
        } catch (error) {
            console.error('Failed to load roadmap from localStorage', error);
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            try {
                if (roadmap) {
                    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap));
                } else {
                    localStorage.removeItem(ROADMAP_STORAGE_KEY);
                }
            } catch (error) {
                console.error('Failed to save roadmap to localStorage', error);
            }
        }
    }, [roadmap, isInitialized]);

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
