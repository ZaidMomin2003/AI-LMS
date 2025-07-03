'use client';
import { AppLayout } from '@/components/AppLayout';
import { CreateTaskForm } from '@/components/plan/CreateTaskForm';
import { KanbanBoard } from '@/components/plan/KanbanBoard';
import type { KanbanTask, TaskPriority } from '@/types';
import { useState, useEffect } from 'react';

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

export default function StudyPlanPage() {
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
    
    const handleAddTask = (content: string, priority: TaskPriority) => {
        const pointsMap: Record<TaskPriority, number> = { 'Hard': 50, 'Moderate': 30, 'Easy': 15 };
        const newTask: KanbanTask = {
            id: `task-${Date.now()}`,
            content,
            columnId: 'todo',
            priority,
            points: pointsMap[priority],
        };
        setTasks((prev) => [newTask, ...prev]);
    };

    return (
        <AppLayout>
            <div className="flex flex-col h-full">
                <div className="p-4 md:p-8 pt-6 space-y-4 shrink-0">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        My Study Plan
                    </h2>
                    <p className="text-muted-foreground">
                        Organize your syllabus and track your progress. Drag and drop to move tasks.
                    </p>
                    <CreateTaskForm onTaskCreate={handleAddTask} />
                </div>
                <div className="flex-1 px-4 md:px-8 pb-4 overflow-x-auto min-w-0">
                   <KanbanBoard tasks={tasks} setTasks={setTasks} />
                </div>
            </div>
        </AppLayout>
    );
}
