'use client';

import type { KanbanTask, TaskPriority } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';

const KANBAN_TASKS_STORAGE_KEY = 'scholarai_kanban_tasks';

const initialTasks: KanbanTask[] = [
    { id: 'task-1', content: 'Read Chapter 1: Introduction to AI', columnId: 'todo', priority: 'Moderate', points: 30 },
    { id: 'task-2', content: 'Complete programming assignment on sorting algorithms', columnId: 'todo', priority: 'Hard', points: 50 },
    { id: 'task-3', content: 'Draft essay on The Great Gatsby', columnId: 'in-progress', priority: 'Moderate', points: 30 },
    { id: 'task-4', content: 'Review lecture notes for chemistry midterm', columnId: 'in-progress', priority: 'Easy', points: 15 },
    { id: 'task-5', content: 'Submit final project for history class', columnId: 'done', priority: 'Hard', points: 50 },
    { id: 'task-6', content: 'Prepare presentation for marketing course', columnId: 'todo', priority: 'Easy', points: 15 },
    { id: 'task-7', content: 'Solve practice problems for calculus', columnId: 'done', priority: 'Moderate', points: 30 },
];

interface TaskContextType {
    tasks: KanbanTask[];
    setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
    addTask: (content: string, priority: TaskPriority, column?: 'todo' | 'in-progress' | 'done', id?: string) => void;
    findTaskById: (id: string) => KanbanTask | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedTasks = localStorage.getItem(KANBAN_TASKS_STORAGE_KEY);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            } else {
                setTasks(initialTasks);
            }
        } catch (error) {
            console.error("Failed to load tasks from localStorage", error);
            setTasks(initialTasks);
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(KANBAN_TASKS_STORAGE_KEY, JSON.stringify(tasks));
            } catch (error) {
                console.error("Failed to save tasks to localStorage", error);
            }
        }
    }, [tasks, isInitialized]);
    
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
