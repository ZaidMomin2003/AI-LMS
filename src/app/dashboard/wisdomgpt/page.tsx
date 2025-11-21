
'use client';

import { AppLayout } from '@/components/AppLayout';
import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Lock } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const ProAccessWall = () => (
    <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline">WisdomGPT is a Pro Feature</CardTitle>
                <CardDescription>Upgrade your plan to get unlimited access to our most advanced AI tutor.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard/pricing">
                        <Gem className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
);

const LoadingSkeleton = () => (
     <div className="flex-1 p-4 h-full">
        <Skeleton className="h-full w-full rounded-xl"/>
    </div>
)


export default function WisdomGptPage() {
    const { subscription, loading } = useSubscription();

    if (loading) {
        return (
            <AppLayout>
                <LoadingSkeleton />
            </AppLayout>
        )
    }

    if (subscription?.status !== 'active') {
        return (
             <AppLayout>
                <ProAccessWall />
            </AppLayout>
        );
    }
    
    return (
        <AppLayout>
            <div className="flex-1 p-2 sm:p-4 h-full">
                <WisdomGptChat />
            </div>
        </AppLayout>
    )
}
