import { SignUpForm } from '@/components/auth/SignUpForm';
import { BookOpenCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1080x1920.png"
          data-ai-hint="students collaborating"
          alt="Abstract background image for signup page"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        <div className="absolute top-8 left-8 z-10">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-headline text-white">
                <BookOpenCheck className="h-6 w-6 text-primary" />
                <span>ScholarAI</span>
            </Link>
        </div>
        <div className="absolute bottom-8 left-8 right-8 p-6 z-10 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
            <blockquote className="text-white">
                <p className="text-lg font-medium">
                &ldquo;Getting started was the best decision for my grades. The instant study aids made learning feel less like a chore and more like an adventure.&rdquo;
                </p>
                <footer className="mt-4 text-sm text-primary font-semibold">Emily Rodriguez</footer>
            </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details to start your AI learning journey.
            </p>
          </div>
          <SignUpForm />
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
