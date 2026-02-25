
'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.06,4.71c2.04-3.46,5.72-6,9.63-6c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const testimonials = [
  {
    text: "The roadmap feature planned my entire finals week. I knew exactly what to study each day and didn't have to stress about it. Total game-changer.",
    name: 'Jasmine K.',
    role: 'AP Student',
    img: `https://picsum.photos/seed/Jasmine/100/100`
  },
  {
    text: "I used to spend hours making my own Quizlets. This does it for me in seconds, and the quizzes are way better. My grades have actually improved.",
    name: 'Leo F.',
    role: 'Sophomore',
    img: `https://picsum.photos/seed/Leo/100/100`
  },
  {
    text: "WisdomGPT is like having a super smart friend you can text at 2 AM when you're stuck on a math problem. It just explains things in a way that makes sense.",
    name: 'Ben A.',
    role: 'Mathlete',
    img: `https://picsum.photos/seed/Ben/100/100`
  },
  {
    text: "I have so much more free time for sports and hanging out with friends because my study sessions are so much more efficient now. No more all-nighters!",
    name: 'Harper J.',
    role: 'Student Athlete',
    img: `https://picsum.photos/seed/Harper/100/100`
  },
];

function ForgotPasswordDialog({ email, onEmailChange }: { email: string; onEmailChange: (email: string) => void }) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState(email);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseEnabled || !auth) {
      toast({ variant: 'destructive', title: 'Error', description: "Firebase is not configured." });
      return;
    }
    if (!resetEmail) {
      toast({ variant: 'destructive', title: 'Error', description: "Please enter an email address." });
      return;
    }
    setIsSending(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setEmailSent(true);
      onEmailChange(resetEmail);
      toast({ title: 'Email Sent', description: `A password reset link has been sent to ${resetEmail}.` });
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      let description = "An error occurred. Please try again.";
      if (error.code === 'auth/user-not-found') {
        description = "No user found with this email address.";
      }
      toast({ variant: 'destructive', title: 'Failed to Send Email', description });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog onOpenChange={() => setEmailSent(false)}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-sm text-primary p-0 h-auto font-normal underline-offset-4 hover:underline">
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            {emailSent
              ? `We've sent a password reset link to ${resetEmail}. Please check your inbox.`
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </DialogDescription>
        </DialogHeader>
        {!emailSent && (
          <form onSubmit={handlePasswordReset}>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="reset-email" className="sr-only">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="m@example.com"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSending}>
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!isFirebaseEnabled || !auth) {
      toast({ variant: 'destructive', title: 'Sign-In Failed', description: "Firebase is not configured correctly." });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Verification Required',
          description: 'Please check your inbox and verify your email address before signing in.',
        });
        setIsLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === 'auth/too-many-requests') {
        description = "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
      }
      toast({ variant: 'destructive', title: 'Sign-In Failed', description });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!isFirebaseEnabled || !auth || !googleProvider) {
      toast({ variant: 'destructive', title: 'Sign-In Failed', description: "Firebase is not configured correctly." });
      return;
    };
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      toast({ variant: 'destructive', title: 'Sign-In Failed', description: error.message || "An unexpected error occurred." });
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

        <div className="relative z-10">
          <div className="mb-12">
            <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
              <BookOpenCheck className="h-6 w-6" />
            </Link>
          </div>

          <div className="mb-10 space-y-3">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Welcome to <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Wisdom</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to your account to continue your journey.
            </p>
          </div>

          <div className="space-y-4">
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

            <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                    placeholder="Enter your password"
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
                <div className="flex justify-end pt-1">
                  <ForgotPasswordDialog email={email} onEmailChange={setEmail} />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="pt-8 text-sm text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</Link>
              {' '} & {' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">Privacy Policy</Link>
            </div>

            <div className="pt-2 text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-foreground hover:underline underline-offset-4 hover:text-primary transition-colors">
                Sign up
              </Link>
            </div>
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
