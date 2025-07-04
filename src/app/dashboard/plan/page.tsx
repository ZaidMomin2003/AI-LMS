'use client';
import { AppLayout } from '@/components/AppLayout';
import { CreateTaskForm } from '@/components/plan/CreateTaskForm';
import { KanbanBoard } from '@/components/plan/KanbanBoard';
import { useTask } from '@/context/TaskContext';
import type { TaskPriority } from '@/types';

export default function StudyPlanPage() {
    const { tasks, setTasks, addTask } = useTask();
    
    const handleAddTask = (content: string, priority: TaskPriority) => {
        addTask(content, priority);
    };

    return (
        <AppLayout>
            <div className="flex flex-col h-full">
                {/* Top container for header and form. This will not scroll horizontally. */}
                <div className="p-4 md:p-8 pt-6 space-y-4">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        My Study Plan
                    </h2>
                    <p className="text-muted-foreground">
                        Organize your syllabus and track your progress. Drag and drop to move tasks.
                    </p>
                    <CreateTaskForm onTaskCreate={handleAddTask} />
                </div>

                {/* Bottom container for the Kanban board, which will scroll horizontally. */}
                <div className="px-4 md:px-8 pb-4 flex-1 overflow-x-auto">
                    <KanbanBoard tasks={tasks} setTasks={setTasks} />
                </div>
            </div>
        </AppLayout>
    );
}
