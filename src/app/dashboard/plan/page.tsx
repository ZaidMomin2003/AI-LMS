
'use client';
import { AppLayout } from '@/components/AppLayout';
import { CreateTaskForm } from '@/components/plan/CreateTaskForm';
import { KanbanBoard } from '@/components/plan/KanbanBoard';
import { useTask } from '@/context/TaskContext';
import type { TaskPriority } from '@/types';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function StudyPlanPage() {
    const { tasks, setTasks, addTask } = useTask();

    const handleAddTask = (content: string, priority: TaskPriority) => {
        addTask(content, priority);
    };

    return (
        <AppLayout>
            <div className="flex-1 p-4 md:p-8 pt-6 relative items-start min-h-screen">
                {/* Background patterns */}
                <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/5 blur-[120px] -z-10" />

                <div className="relative z-10 space-y-8 max-w-7xl mx-auto flex flex-col h-full">
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-red-500/10 text-red-500 shadow-sm border border-red-500/10">
                                <Target className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest text-red-500/70">Strategic Planning</Badge>
                        </div>
                        <h2 className="text-4xl font-headline font-black tracking-tight">
                            Master <span className="bg-gradient-to-r from-red-500 to-primary bg-clip-text text-transparent">Strategy</span>
                        </h2>
                        <p className="text-muted-foreground font-medium text-lg opacity-80 max-w-2xl">
                            Architect your academic success. Break down your syllabus into manageable milestones and conquer your goals.
                        </p>
                    </div>

                    <CreateTaskForm onTaskCreate={handleAddTask} />

                    {/* Kanban Board Container */}
                    <div className="flex-1 pb-10 overflow-x-auto min-h-0 -mx-4 md:-mx-8 px-4 md:px-8 custom-scrollbar">
                        <KanbanBoard tasks={tasks} setTasks={setTasks} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
