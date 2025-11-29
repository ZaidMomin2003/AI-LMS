
'use client';

import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck, Gem, Lock } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WisdomGptPage() {
    const { canUseFeature } = useSubscription();
    
    if (!canUseFeature('wisdomGpt')) {
        return (
             <div className="flex flex-col h-screen bg-background">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                            <BookOpenCheck className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                            <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </header>
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center mx-auto">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                                <Lock className="w-6 h-6" />
                            </div>
                            <CardTitle className="font-headline">WisdomGPT is a Pro Feature</CardTitle>
                            <CardDescription>Upgrade your plan to get unlimited access to our most powerful AI assistant.</CardDescription>
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
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                        <BookOpenCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                        <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                    </div>
                </div>
                <Button asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
            </header>
            {/* The children (page content) will fill the remaining space */}
            <div className="flex-1 min-h-0">
                <WisdomGptChat />
            </div>
        </div>
    )
}
