import { LoginForm } from '@/components/auth/LoginForm';
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialCard = ({ quote, name, handle }: { quote: string; name: string; handle: string }) => (
    <Card className="bg-card/50 p-6 rounded-xl shadow-lg border border-border/20 backdrop-blur-sm">
        <CardContent className="p-0">
            <p className="text-foreground/80 mb-4">&ldquo;{quote}&rdquo;</p>
            <footer className="font-semibold">
                <p className="text-foreground">{name}</p>
                <p className="text-muted-foreground text-sm font-normal">{handle}</p>
            </footer>
        </CardContent>
    </Card>
);

const testimonials = [
    {
      quote: "This platform has single-handedly saved me hours of manual note-taking. The AI-generated content is accurate and incredibly helpful for exam prep.",
      name: "Sofia Davis",
      handle: "Biochemistry Student"
    },
    {
      quote: "As a professional, I need to get up to speed on new topics fast. wisdom is my secret weapon for client meetings.",
      name: "Alex Johnson",
      handle: "Tech Consultant"
    },
    {
      quote: "I've never been a great test-taker, but the quizzes helped me identify my weak spots. My grades have actually improved!",
      name: "Maria Garcia",
      handle: "High School Junior"
    },
     {
      quote: "The best part is how it adapts to any subject I throw at it, from history to complex scientific theories. It's a game-changer.",
      name: "Chen Wei",
      handle: "Lifelong Learner"
    }
  ];

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-muted p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-muted via-background/50 to-muted -z-0" />
          <div className="relative w-full max-w-md h-full max-h-[80vh] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] z-10">
              <div className="animate-marquee-y space-y-4">
                  {[...testimonials, ...testimonials].map((t, i) => (
                      <TestimonialCard key={i} {...t} />
                  ))}
              </div>
          </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
          <div className="absolute top-8 left-8 z-10">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-headline text-foreground">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                    <BookOpenCheck className="h-5 w-5" />
                  </div>
                  <span>wisdom</span>
              </Link>
          </div>
          <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold font-headline">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
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
