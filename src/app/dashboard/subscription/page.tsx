
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/context/SubscriptionContext';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const proFeatures = [
    "Unlimited Topic Generations",
    "AI-Powered Notes, Flashcards & Quizzes",
    "SageMaker AI Assistant",
    "Personalized Study Roadmaps",
    "Capture the Answer (Photo Solver)",
    "Kanban Study Planner",
    "Pomodoro Focus Timer",
    "Performance Analytics",
];

export default function SubscriptionPage() {
    const { subscription, loading: subLoading } = useSubscription();
    const router = useRouter();

    if (subLoading) {
        return (
            <AppLayout>
                <div className="flex h-full w-full items-center justify-center bg-background">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </AppLayout>
        )
    }

    if (!subscription || subscription.status !== 'active') {
        return (
            <AppLayout>
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                     <Card className="max-w-2xl mx-auto border-destructive/50">
                        <CardHeader className="text-center">
                            <XCircle className="w-12 h-12 text-destructive mx-auto mb-2"/>
                            <CardTitle className="font-headline">No Active Subscription</CardTitle>
                            <CardDescription>
                                You do not have an active subscription. Please complete the onboarding process to subscribe.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button onClick={() => router.push('/onboarding?step=subscribe')}>
                                Subscribe Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }
    
    return (
        <AppLayout>
            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        My Subscription
                    </h2>
                    <p className="text-muted-foreground">
                        Here are the details of your current plan.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Current Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Plan</p>
                                <p className="text-2xl font-bold font-headline text-primary">{subscription.planName}</p>
                            </div>
                             <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="text-lg font-semibold capitalize text-green-500">{subscription.status}</p>
                            </div>
                             <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Manage Billing</p>
                                <p className="text-sm">
                                    Your subscription is managed via PayPal. Please log in to your PayPal account to make any changes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Features Included</CardTitle>
                            <CardDescription>Your plan gives you full access to all Pro features.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {proFeatures.map(feature => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
