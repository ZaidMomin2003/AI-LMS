
'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
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
import Image from 'next/image';

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
  const [emailSent, setEmailSent] = useState(false);

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!isFirebaseEnabled || !auth) {
      toast({ variant: 'destructive', title: 'Sign-Up Failed', description: "Firebase is not configured correctly." });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setEmailSent(true);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox to verify your email address.',
      });
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email address is already in use. Please sign in or use a different email.";
      } else if (error.code === 'auth/weak-password') {
        description = "Your password is too weak. Please use at least 6 characters.";
      }
      toast({ variant: 'destructive', title: 'Sign-Up Failed', description });
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
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      toast({ variant: 'destructive', title: 'Sign-Up Failed', description: error.message || "An unexpected error occurred." });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Left Side: Auth Form */}
      <div className="relative flex w-full flex-col justify-center px-8 md:w-[45%] lg:px-20 xl:px-28 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.05] dark:opacity-[0.1]" style={{ backgroundSize: '32px 32px' }} />

        {/* Subtle Primary Glow */}
        <div className="absolute -left-20 top-1/4 z-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 z-0 h-96 w-96 rounded-full bg-purple-600/5 blur-[120px]" />

        <div className="relative z-10 text-left">
          <div className="mb-12">
            <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
              <BookOpenCheck className="h-6 w-6" />
            </Link>
          </div>

          <div className="mb-10 space-y-3">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Join <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Wisdom AI</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {emailSent
                ? 'One last step! Check your email.'
                : 'Let\'s create your new account to get started.'
              }
            </p>
          </div>

          <div className="space-y-4">
            {emailSent ? (
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card/50 p-6 text-sm leading-relaxed text-muted-foreground shadow-inner backdrop-blur-sm">
                  <p>
                    A verification link has been sent to <strong className="text-foreground">{email}</strong>.
                    Please check your inbox (and spam folder) to activate your account.
                  </p>
                </div>
                <Button asChild variant="outline" className="h-12 w-full border-border bg-card/50 text-foreground hover:bg-accent hover:text-accent-foreground shadow-lg backdrop-blur-sm">
                  <Link href="/login">Go to Sign In</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-center border-border bg-card/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
                  Continue with Google
                </Button>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="mx-4 flex-shrink text-xs font-medium uppercase tracking-widest text-muted-foreground/50">OR</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 border-border bg-card/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="h-12 border-border bg-card/50 text-foreground pr-10 placeholder:text-muted-foreground/50 focus:border-primary/50"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>

                <div className="pt-8 text-sm text-muted-foreground">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</Link>
                  {' '} & {' '}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">Privacy Policy</Link>
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  Already signed up?{' '}
                  <Link href="/login" className="font-bold text-foreground hover:underline underline-offset-4 hover:text-primary transition-colors">
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Aesthetic bottom bar */}
          <div className="mt-20 h-[2px] w-64 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-30"></div>
        </div>
      </div>

      {/* Right Side: Mockup Content */}
      <div className="hidden flex-1 items-center justify-center bg-muted/30 p-12 md:flex overflow-hidden relative">
        {/* Background Grid Pattern for right side too */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07]" style={{ backgroundSize: '32px 32px' }} />

        <div className="relative z-10 h-full w-full max-w-4xl overflow-hidden rounded-[40px] bg-gradient-to-tr from-[#ff2d55] via-[#5e5ce6] to-[#64d2ff] p-4 shadow-2xl">
          <div className="h-full w-full overflow-hidden rounded-[32px] bg-white ring-8 ring-white/10 relative">
            <Image
              src="/chatbot.jpg"
              alt="Wisdom AI Interface"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
