import { SignUpForm } from '@/components/auth/SignUpForm';
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
      quote: "Getting started was the best decision for my grades. The instant study aids made learning feel less like a chore and more like an adventure.",
      name: "Emily Rodriguez",
      handle: "University Freshman"
    },
    {
        quote: "I was skeptical about AI for studying, but wisdom proved me wrong. It's like having a personal tutor available 24/7.",
        name: "David Smith",
        handle: "Medical Student"
    },
    {
        quote: "The roadmap and study plan features are incredible for staying organized. I finally feel in control of my syllabus.",
        name: "Aisha Khan",
        handle: "Computer Science Major"
    },
    {
        quote: "It's not just for students. I use it to learn new hobbies and skills in my free time. Highly recommended!",
        name: "Tom Bradley",
        handle: "Creative Director"
    }
  ];

export default function SignUpPage() {
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
                  <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                    <BookOpenCheck className="h-5 w-5" />
                  </div>
                  <span>wisdom</span>
              </Link>
          </div>
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details to start your AI learning journey.
            </p>
          </div>
          <SignUpForm />
           <div className="mt-4 text-center text-sm text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
}
