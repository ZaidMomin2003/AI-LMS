import { LoginForm } from '@/components/auth/LoginForm';
import { BookOpenCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1080x1920.png"
          data-ai-hint="student studying"
          alt="Abstract background image for login page"
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
                &ldquo;This platform has single-handedly saved me hours of manual note-taking. The AI-generated content is accurate and incredibly helpful for exam prep.&rdquo;
                </p>
                <footer className="mt-4 text-sm text-primary font-semibold">Sofia Davis</footer>
            </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
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
