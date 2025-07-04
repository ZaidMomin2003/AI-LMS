'use client';

import type { KanbanTask, TaskPriority } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const KANBAN_TASKS_STORAGE_KEY_PREFIX = 'scholarai_kanban_tasks';

interface TaskContextType {
    tasks: KanbanTask[];
    setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
    addTask: (content: string, priority: TaskPriority, column?: 'todo' | 'in-progress' | 'done', id?: string) => void;
    findTaskById: (id: string) => KanbanTask | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [storageKey, setStorageKey] = useState('');

    useEffect(() => {
        if (user) {
            setStorageKey(`${KANBAN_TASKS_STORAGE_KEY_PREFIX}_${user.uid}`);
        } else {
            setStorageKey('');
        }
    }, [user]);

    useEffect(() => {
        if (storageKey) {
            try {
                const storedTasks = localStorage.getItem(storageKey);
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                } else {
                    setTasks([]);
                }
            } catch (error) {
                console.error("Failed to load tasks from localStorage", error);
                setTasks([]);
            }
        } else {
            setTasks([]);
        }
        setIsInitialized(true);
    }, [storageKey]);

    useEffect(() => {
        if (isInitialized && storageKey) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(tasks));
            } catch (error) {
                console.error("Failed to save tasks to localStorage", error);
            }
        }
    }, [tasks, isInitialized, storageKey]);
    
    const addTask = (content: string, priority: TaskPriority, column: 'todo' | 'in-progress' | 'done' = 'todo', id?: string) => {
        const pointsMap: Record<TaskPriority, number> = { 'Hard': 50, 'Moderate': 30, 'Easy': 15 };
        const newTask: KanbanTask = {
            id: id || `task-${Date.now()}`,
            content,
            columnId: column,
            priority,
            points: pointsMap[priority],
        };
        setTasks((prev) => [newTask, ...prev]);
    };

    const findTaskById = (id: string) => {
        return tasks.find(task => task.id === id);
    }

    return (
        <TaskContext.Provider value={{ tasks, setTasks, addTask, findTaskById }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};
