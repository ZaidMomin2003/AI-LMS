'use client';

import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface RoadmapContextType {
    roadmap: GenerateRoadmapOutput | null;
    setRoadmap: (roadmap: GenerateRoadmapOutput | null) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

const ROADMAP_STORAGE_KEY_PREFIX = 'scholarai_roadmap';

export const RoadmapProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState<GenerateRoadmapOutput | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [storageKey, setStorageKey] = useState('');

    useEffect(() => {
        if (user) {
            setStorageKey(`${ROADMAP_STORAGE_KEY_PREFIX}_${user.uid}`);
        } else {
            setStorageKey('');
        }
    }, [user]);

    useEffect(() => {
        if (storageKey) {
            try {
                const storedRoadmap = localStorage.getItem(storageKey);
                if (storedRoadmap) {
                    setRoadmap(JSON.parse(storedRoadmap));
                } else {
                    setRoadmap(null);
                }
            } catch (error) {
                console.error('Failed to load roadmap from localStorage', error);
                setRoadmap(null);
            }
        } else {
            setRoadmap(null);
        }
        setIsInitialized(true);
    }, [storageKey]);

    useEffect(() => {
        if (isInitialized && storageKey) {
            try {
                if (roadmap) {
                    localStorage.setItem(storageKey, JSON.stringify(roadmap));
                } else {
                    localStorage.removeItem(storageKey);
                }
            } catch (error) {
                console.error('Failed to save roadmap to localStorage', error);
            }
        }
    }, [roadmap, isInitialized, storageKey]);

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
