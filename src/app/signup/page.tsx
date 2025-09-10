
'use client';

import { BookOpenCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
        router.replace('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div 
        aria-hidden="true" 
        className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" 
      />
      <Card className="w-full max-w-sm overflow-hidden border-border/20 bg-card/60 shadow-lg backdrop-blur-lg">
        <CardContent className="p-8 text-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">Wisdomis Fun</span>
          </Link>
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold font-headline">Create Your Account</h1>
            <p className="text-balance text-muted-foreground">
              Get started in seconds by signing up with your Google account.
            </p>
          </div>
          <div className="my-8">
            <GoogleSignInButton />
          </div>
           <div className="mt-4 text-center text-xs text-muted-foreground">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                    Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
