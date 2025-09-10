
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

const testimonials = [
  {
    quote: "My AP Bio notes were a mess. One click and Wisdomis Fun organized everything. I actually understand cellular respiration now!",
    name: 'Maya R.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote: "I used to spend hours making my own Quizlets. This does it for me in seconds, and the quizzes are way better.",
    name: 'Leo F.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    quote: "The roadmap feature planned my entire finals week. I knew exactly what to study each day and didn't have to stress about it.",
    name: 'Jasmine K.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    quote: "SageMaker is like having a super smart friend you can text at 2 AM when you're stuck on a math problem.",
    name: 'Ben A.',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];


const TestimonialCard = ({ quote, name, avatar }: { quote: string, name: string, avatar: string }) => (
  <Card className="w-[300px] flex-shrink-0 snap-center rounded-2xl border-2 border-border/10 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
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

export default function LoginPage() {
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
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      {/* Left side: Testimonials (Desktop only) */}
      <div className="relative hidden flex-col items-center justify-center bg-secondary p-8 md:flex">
         <div 
            aria-hidden="true" 
            className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-secondary to-secondary" 
        />
        <div className="relative z-10 space-y-4 text-center">
            <Link href="/" className="mb-8 inline-flex items-center gap-2">
                <BookOpenCheck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline">Wisdomis Fun</span>
            </Link>
            <h2 className="text-3xl font-bold font-headline">Join Thousands of Successful Students</h2>
            <p className="text-muted-foreground">See what others are saying about their journey with us.</p>
        </div>
        <div
            className="group relative mt-12 w-full max-w-lg overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,#000_15%,#000_85%,transparent_100%)]"
            style={{ height: '450px' }}
        >
            <div className="flex animate-marquee-y flex-col items-center gap-4 pr-4 group-hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
                <TestimonialCard key={i} {...t} />
            ))}
            </div>
        </div>
      </div>

      {/* Right side: Sign-in form (Full screen on mobile) */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div 
          aria-hidden="true" 
          className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background md:hidden" 
        />
        <div className="w-full max-w-sm">
          <GoogleSignInButton />
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-semibold text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
