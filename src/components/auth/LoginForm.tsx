
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signInWithPopup, type User } from 'firebase/auth';
import { auth, googleProvider, isFirebaseEnabled } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { getUserDoc } from '@/services/firestore';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.06,4.71c2.04-3.46,5.72-6,9.63-6c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
)

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSuccessfulLogin = async (user: User) => {
    // Check if user has onboarded. If not, redirect to onboarding.
    const userDoc = await getUserDoc(user.uid);
    if (userDoc && userDoc.profile) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  async function handleGoogleSignIn() {
    if (!auth || !googleProvider) return;
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleSuccessfulLogin(result.user);
    } catch (error: any) {
      let description = "An error occurred during Google Sign-In. Please try again.";
      if (error.code === 'auth/account-exists-with-different-credential') {
        description = "An account already exists with this email address. Please sign in with the original method you used.";
      }
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: description,
      });
    } finally {
        setIsGoogleLoading(false);
    }
  }

  if (!isFirebaseEnabled) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Firebase Not Configured</AlertTitle>
            <AlertDescription>
                Authentication is disabled because Firebase is not set up correctly.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
          {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
          Login with Google
        </Button>
    </div>
  );
}
