import { SignUpForm } from '@/components/auth/SignUpForm';
import { BookOpenCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
             <Link href="/" className="flex items-center justify-center gap-2 text-lg font-semibold font-headline text-foreground mb-4">
                <BookOpenCheck className="h-8 w-8 text-primary" />
                <span className="text-2xl">ScholarAI</span>
            </Link>
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details to start your AI learning journey.
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
       <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1080x1920.png"
          data-ai-hint="abstract education"
          alt="Abstract background image for signup page"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        <div className="relative h-full flex flex-col justify-end items-start p-12">
            <div className="p-8 z-10 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
                <blockquote className="text-white">
                    <p className="text-lg font-medium">
                    &ldquo;ScholarAI revolutionized my study habits. What used to take days of preparation now takes minutes. The future of learning is here.&rdquo;
                    </p>
                    <footer className="mt-4 text-sm text-primary font-semibold">Alex Johnson</footer>
                </blockquote>
            </div>
        </div>
      </div>
    </div>
  );
}
