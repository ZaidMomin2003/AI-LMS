
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
        
        // If profile data includes a referralSource, user has already onboarded.
        if (!profileLoading && profile && profile.referralSource) {
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
    if (user && (!profile || !profile.referralSource)) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-3">
                         <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                            <BookOpenCheck className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                            <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                        </div>
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
