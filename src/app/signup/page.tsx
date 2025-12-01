
'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, isFirebaseEnabled } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, BookOpenCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestimonialColumn } from '@/components/landing/Testimonials';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.06,4.71c2.04-3.46,5.72-6,9.63-6c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const testimonials = [
  {
    text: "I uploaded a picture of a confusing physics problem from my homework and it gave me the answer AND the steps. I was shocked it actually worked.",
    name: 'Noah P.',
    role: 'Physics Student',
    img: 'https://picsum.photos/seed/Noah/100/100'
  },
  {
    text: "My English teacher was so impressed with my detailed analysis of 'The Great Gatsby.' Little does she know, AI helped me organize my thoughts!",
    name: 'Sophia W.',
    role: 'Literature Lover',
    img: 'https://picsum.photos/seed/Sophia/100/100'
  },
  {
    text: "Being able to just paste my whole syllabus for the semester and get a study plan was incredible. I've never felt so organized.",
    name: 'Liam G.',
    role: 'Grade 12',
    img: 'https://picsum.photos/seed/Liam/100/100'
  },
  {
    text: "The Pomodoro timer keeps me from getting distracted by my phone. Those 25-minute focus blocks are surprisingly effective.",
    name: 'Isabella C.',
    role: 'Procrastinator turned Pro',
    img: 'https://picsum.photos/seed/Isabella/100/100'
  }
];

export default function SignUpPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    async function handleEmailSignUp(e: React.FormEvent) {
      e.preventDefault();
      if (!isFirebaseEnabled || !auth) {
        toast({ variant: 'destructive', title: 'Sign-Up Failed', description: "Firebase is not configured correctly." });
        return;
      }
      setIsLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/onboarding');
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Sign-Up Failed', description: error.message });
      } finally {
        setIsLoading(false);
      }
    }

    async function handleGoogleSignIn() {
        if (!isFirebaseEnabled || !auth || !googleProvider) {
            toast({ variant: 'destructive', title: 'Sign-Up Failed', description: "Firebase is not configured correctly." });
            return;
        };
        setIsGoogleLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/onboarding');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Sign-Up Failed', description: error.message || "An unexpected error occurred." });
        } finally {
            setIsGoogleLoading(false);
        }
    }

    return (
        <div className="w-full lg:grid lg:grid-cols-2 h-screen">
            <div className="hidden bg-secondary lg:flex items-center justify-center p-12 overflow-hidden h-screen">
                 <div className="w-full max-w-md h-full relative">
                    <TestimonialColumn testimonials={testimonials} duration={50} />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-secondary to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
                </div>
            </div>
            <div className="flex items-center justify-center p-4 h-screen">
                <div className="w-full max-w-sm">
                    <Card className="border-0 shadow-none sm:border sm:shadow-lg">
                        <CardHeader className="text-center">
                            <Link href="/" className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                               <BookOpenCheck className="h-8 w-8" />
                            </Link>
                            <CardTitle className="text-3xl font-headline">Get Started</CardTitle>
                            <CardDescription>Create your account and start your AI-powered learning journey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleEmailSignUp} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                               <div className="relative">
                                <Input 
                                  id="password" 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Password"
                                  required 
                                  value={password} 
                                  onChange={(e) => setPassword(e.target.value)} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                              </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Create Account
                            </Button>
                          </form>

                          <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                          </div>
                          
                          <Button 
                              variant="outline"
                              className="w-full h-11" 
                              onClick={handleGoogleSignIn} 
                              disabled={isGoogleLoading}
                          >
                            {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
                            Sign Up with Google
                          </Button>
                          
                          <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                              Sign in
                            </Link>
                          </div>
                        </CardContent>
                    </Card>
                    <div className="mt-4 px-4 text-center text-xs text-muted-foreground">
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
                </div>
            </div>
        </div>
    );
}

    