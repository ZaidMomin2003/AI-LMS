'use client';

import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { BookOpenCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';

export default function OnboardingPage() {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
            return;
        }
        
        // If profile data exists, user has already onboarded.
        if (!profileLoading && profile) {
            router.replace('/dashboard');
        }
    }, [user, authLoading, profile, profileLoading, router]);

    if (authLoading || profileLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    // Only show the form if the user is authenticated but hasn't onboarded yet
    if (user && !profile) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-headline">
                        <BookOpenCheck className="h-6 w-6 text-primary" />
                        <span>ScholarAI</span>
                    </Link>
                </div>
                <div className="w-full max-w-2xl">
                    <OnboardingForm />
                </div>
            </div>
        );
    }

    // Fallback loading screen while redirecting
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
}
