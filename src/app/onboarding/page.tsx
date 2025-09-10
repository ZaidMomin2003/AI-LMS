
'use client';

import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { BookOpenCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { OnboardingSubscription } from '@/components/onboarding/OnboardingSubscription';

function OnboardingComponent() {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const router = useRouter();
    const searchParams = useSearchParams();
    const step = searchParams.get('step');

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
            return;
        }
        
        // If profile exists and we are not on the subscription step, user has onboarded.
        if (!profileLoading && profile && step !== 'subscribe') {
            router.replace('/dashboard');
        }
    }, [user, authLoading, profile, profileLoading, router, step]);

    const isLoading = authLoading || profileLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (step === 'subscribe') {
        return <OnboardingSubscription />;
    }

    if (user && !profile) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-headline">
                        <BookOpenCheck className="h-6 w-6 text-primary" />
                        <span className="font-bold leading-tight">Wisdom<br className="sm:hidden" />is Fun</span>
                    </Link>
                </div>
                <div className="w-full max-w-2xl">
                    <OnboardingForm />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
}


export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <OnboardingComponent />
        </Suspense>
    );
}
