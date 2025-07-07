
'use client';

import type { KanbanTask, TaskPriority } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { debounce } from 'lodash';

interface TaskContextType {
    tasks: KanbanTask[];
    setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
    addTask: (content: string, priority: TaskPriority, column?: 'todo' | 'in-progress' | 'done', id?: string) => void;
    findTaskById: (id: string) => KanbanTask | undefined;
    loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Debounce saving to Firestore to avoid too many writes during rapid changes (like drag & drop)
const debouncedUpdate = debounce((uid: string, tasks: KanbanTask[]) => {
    updateUserDoc(uid, { tasks });
}, 500);


export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [tasks, setTasksInternal] = useState<KanbanTask[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                setLoading(true);
                try {
                    const userData = await getUserDoc(user.uid);
                    setTasksInternal(userData?.tasks || []);
                } catch (error) {
                    console.error("Failed to fetch tasks:", error);
                    setTasksInternal([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setTasksInternal([]);
                setLoading(false);
            }
        };
        fetchTasks();
    }, [user]);

    const setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>> = (newTasksAction) => {
        const newTasks = typeof newTasksAction === 'function' ? newTasksAction(tasks) : newTasksAction;
        setTasksInternal(newTasks);
        if (user) {
            debouncedUpdate(user.uid, newTasks);
        }
    };

    const addTask = (content: string, priority: TaskPriority, column: 'todo' | 'in-progress' | 'done' = 'todo', id?: string) => {
        const pointsMap: Record<TaskPriority, number> = { 'Hard': 50, 'Moderate': 30, 'Easy': 15 };
        const newTask: KanbanTask = {
            id: id || `task-${Date.now()}`,
            content,
            columnId: column,
            priority,
            points: pointsMap[priority],
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const findTaskById = (id: string) => {
        return tasks.find(task => task.id === id);
    }

    return (
        <TaskContext.Provider value={{ tasks, setTasks, addTask, findTaskById, loading }}>
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
