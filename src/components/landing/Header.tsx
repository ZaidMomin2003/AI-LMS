
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

export function Header() {
  const { user, loading } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span className="font-bold leading-tight text-base">Wisdom<br className="sm:hidden" />is Fun</span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/#features" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              Features
            </Link>
            <Link href="/#use-cases" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              Use Cases
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              Pricing
            </Link>
            <Link href="https://scholar.featurebase.app/roadmap" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              Roadmap
            </Link>
            <Link href="/#faq" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              FAQ
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-foreground/80 text-muted-foreground">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {!loading && (
            <Button asChild>
              {user ? (
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
              ) : (
                  <Link href="/signup">Get Started</Link>
              )}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
