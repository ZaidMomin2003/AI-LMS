import { AppLayout } from '@/components/AppLayout';
import { AddExamForm } from '@/components/exam/AddExamForm';

export default function ExamPage() {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        Set Your Exam Target
                    </h2>
                    <p className="text-muted-foreground">
                        Define your next big exam to start the countdown.
                    </p>
                </div>
                <AddExamForm />
            </div>
        </AppLayout>
    )
}
