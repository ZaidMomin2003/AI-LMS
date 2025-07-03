'use client';
import { AppLayout } from '@/components/AppLayout';
import { KanbanBoard } from '@/components/plan/KanbanBoard';

export default function StudyPlanPage() {
    return (
        <AppLayout>
            <div className="flex-1 flex flex-col h-full">
                <div className="p-4 md:p-8 pt-6 space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        My Study Plan
                    </h2>
                    <p className="text-muted-foreground">
                        Organize your syllabus and track your progress. Drag and drop to move tasks.
                    </p>
                </div>
                <div className="flex-1 overflow-x-auto px-4 md:px-8">
                   <KanbanBoard />
                </div>
            </div>
        </AppLayout>
    );
}
