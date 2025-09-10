
'use client';

import { AppLayout } from '@/components/AppLayout';
import { AddExamForm } from '@/components/exam/AddExamForm';
import { useSubscription } from '@/context/SubscriptionContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function ExamContent() {
    const { subscription, loading: subLoading } = useSubscription();
    const router = useRouter();

    useEffect(() => {
        if (!subLoading && (!subscription || subscription.status !== 'active')) {
            router.replace('/onboarding?step=subscribe');
        }
    }, [subscription, subLoading, router]);

    if (subLoading || !subscription || subscription.status !== 'active') {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
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

export default function ExamPage() {
    return <ExamContent />;
}
