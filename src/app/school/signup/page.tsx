
'use client';

import { SchoolSignUpForm } from '@/components/auth/SchoolSignUpForm';
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
      quote: "Integrating Wisdomis Fun was seamless. Our teachers saved hours on prep, and student engagement in complex subjects has visibly increased.",
      name: "Dr. Alisha Chen",
      handle: "Principal, Northwood High"
    },
    {
      quote: "The analytics dashboard gives us incredible insight into which subjects students are struggling with, allowing us to intervene proactively.",
      name: "Marcus Holloway",
      handle: "Head of Academics, Lakeside Academy"
    },
    {
      quote: "Our students love the AI tutor. It provides them with 24/7 support that we couldn't offer otherwise. It's a huge win for student equity.",
      name: "Fatima Al-Jamil",
      handle: "District Superintendent"
    },
     {
      quote: "The platform's ability to generate curriculum-aligned materials on the fly is a game-changer for our diverse student body.",
      name: "Samuel Greene",
      handle: "IT Director, Maple Leaf Schools"
    }
  ];

export default function SchoolAdminSignUpPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-muted p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-muted via-background/50 to-muted -z-0" />
          <div className="relative w-full max-w-md h-full max-h-[80vh] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] z-10">
              <div className="animate-marquee-y [animation-direction:reverse] space-y-4">
                  {[...testimonials, ...testimonials].map((t, i) => (
                      <TestimonialCard key={i} {...t} />
                  ))}
              </div>
          </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
          <div className="absolute top-8 left-8 z-10">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-headline text-foreground">
                  <BookOpenCheck className="h-6 w-6 text-primary" />
                  <span className="font-bold leading-tight">Wisdom<br className="sm:hidden" />is Fun</span>
              </Link>
          </div>
        <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center pt-4">
                <h1 className="text-3xl font-bold font-headline">Create a School Account</h1>
                <p className="text-balance text-muted-foreground">
                Get started by creating an administrator account for your institution.
                </p>
            </div>
            <SchoolSignUpForm />
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/school/login" className="underline font-semibold text-primary">
                    Login
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
