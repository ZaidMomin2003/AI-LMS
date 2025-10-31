
'use client';

import type { KanbanTask, TaskPriority } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';
import { debounce } from 'lodash';
import { isFirebaseEnabled } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type ColumnId = 'todo' | 'in-progress' | 'done';
const columnOrder: ColumnId[] = ['todo', 'in-progress', 'done'];


interface TaskContextType {
    tasks: KanbanTask[];
    setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
    addTask: (content: string, priority: TaskPriority, column?: ColumnId, id?: string) => void;
    moveTask: (taskId: string, direction: 'left' | 'right') => void;
    findTaskById: (id: string) => KanbanTask | undefined;
    loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const debouncedUpdate = debounce((uid: string, tasks: KanbanTask[]) => {
    if (isFirebaseEnabled) {
        updateUserDoc(uid, { tasks });
    }
}, 500);


export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [tasks, setTasksInternal] = useState<KanbanTask[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchTasks = async () => {
            if (user && isFirebaseEnabled) {
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
        if (user && isFirebaseEnabled) {
            debouncedUpdate(user.uid, newTasks);
        }
    };

    const addTask = (content: string, priority: TaskPriority, column: ColumnId = 'todo', id?: string) => {
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
    
    const moveTask = (taskId: string, direction: 'left' | 'right') => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const currentIndex = columnOrder.indexOf(task.columnId);
        const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex >= 0 && nextIndex < columnOrder.length) {
            const newColumnId = columnOrder[nextIndex];
            setTasks(prev => 
                prev.map(t => t.id === taskId ? { ...t, columnId: newColumnId } : t)
            );
            toast({
                title: 'Task Moved!',
                description: `Moved to ${newColumnId.replace('-', ' ')}.`
            });
        }
    };

    const findTaskById = (id: string) => {
        return tasks.find(task => task.id === id);
    }

    return (
        <TaskContext.Provider value={{ tasks, setTasks, addTask, moveTask, findTaskById, loading }}>
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
