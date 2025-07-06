'use client';

import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { BookOpenCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
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
