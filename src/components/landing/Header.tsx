'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';

export function Header() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span className="font-bold">ScholarAI</span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <button onClick={() => scrollTo('features')} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </button>
            <button onClick={() => scrollTo('use-cases')} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Use Cases
            </button>
            <button onClick={() => scrollTo('faq')} className="transition-colors hover:text-foreground/80 text-foreground/60">
              FAQ
            </button>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
