
'use client';

import { BookOpenCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/context/ProfileContext';


const testimonials = [
  {
    quote: "This is the only study tool I've actually stuck with. It's so easy to use and it genuinely helps me feel less anxious about big tests.",
    name: 'Olivia M.',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    quote: "I uploaded a picture of a confusing physics problem and it gave me the answer AND the steps. I was shocked it actually worked.",
    name: 'Noah P.',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    quote: "My English teacher was so impressed with my detailed analysis of 'The Great Gatsby.' Little does she know, AI helped me organize my thoughts!",
    name: 'Sophia W.',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    quote: "Being able to just paste my whole syllabus and get a study plan was incredible. I've never felt so organized.",
    name: 'Liam G.',
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
];


const TestimonialCard = ({ quote, name, avatar }: { quote: string, name: string, avatar: string }) => (
  <Card className="w-[350px] flex-shrink-0 snap-center rounded-2xl border-2 border-border/10 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
    <CardContent className="flex h-full flex-col p-0">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <blockquote className="my-3 flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold">{name}</p>
      </footer>
    </CardContent>
  </Card>
);

export default function SignUpPage() {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
          if (!profileLoading && profile) {
            router.replace('/dashboard');
          } else if (!profileLoading && !profile) {
            router.replace('/onboarding');
          }
        }
    }, [user, profile, authLoading, profileLoading, router]);

    const isLoading = authLoading || (user && profileLoading);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
  
  if (!user) {
    return (
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
        {/* Left side: Testimonials (Desktop only) */}
        <div className="relative hidden flex-col items-center justify-center bg-secondary p-8 md:flex">
           <div 
              aria-hidden="true" 
              className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-secondary to-secondary" 
          />
          <div className="relative z-10 space-y-4 text-center">
              <h2 className="text-3xl font-bold font-headline">Join Thousands of Successful Students</h2>
              <p className="text-muted-foreground">See what others are saying about their journey with us.</p>
          </div>
          <div
              className="group relative mt-12 w-full max-w-4xl overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
          >
              <div className="flex animate-marquee-x items-stretch gap-8 pr-8 group-hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials].map((t, i) => (
                  <TestimonialCard key={i} {...t} />
              ))}
              </div>
          </div>
        </div>

        {/* Right side: Sign-up form (Full screen on mobile) */}
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div 
            aria-hidden="true" 
            className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background md:hidden" 
          />
           <Card className="w-full max-w-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                  <div className="w-full max-w-sm text-center">
                      <Link href="/" className="mb-4 inline-flex items-center gap-2">
                          <BookOpenCheck className="h-8 w-8 text-primary" />
                          <span className="text-2xl font-bold font-headline">Wisdomis Fun</span>
                      </Link>
                      <h1 className="text-2xl font-bold font-headline">Create an Account</h1>
                      <p className="text-muted-foreground">It's free to get started. Let's begin!</p>
                  </div>
                  <GoogleSignInButton />
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
              </CardContent>
          </Card>
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline font-semibold text-primary">
                Login
              </Link>
            </div>
        </div>
      </div>
    );
  }
  
  // Fallback for the brief moment user exists but profile is still loading
  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
  );
}
