
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import {
  Github,
  Linkedin,
  Twitter,
  Moon,
  Sun,
  BookOpenCheck
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';


const footerNav = {
    company: [
      { name: 'About', href: '/developer' },
      { name: 'Institution', href: '/business' },
      { name: 'Contact', href: '/#contact' },
    ],
    features: [
      { name: 'Stories', href: '/stories' },
      { name: 'SageMaker', href: '/#features' },
      { name: 'Roadmaps', href: '/#features' },
      { name: 'Quizzes', href: '/#features' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  };

const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
];


export function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!mounted) return null;

  return (
    <footer className="w-full border-t">
        {/* Top Section */}
        <div className="container m-auto grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                    <BookOpenCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                    <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                </div>
            </Link>
            <p className="text-muted-foreground max-w-md">
              The ultimate AI-powered toolkit for students and learners. Master any subject, instantly.
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-md space-y-3"
            >
              <label htmlFor="email" className="block text-sm font-medium">
                Subscribe to our newsletter
              </label>
              <div className="relative w-full">
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="h-12 w-full"
                  required
                />
                <Button
                  type="submit"
                  className="absolute top-1.5 right-1.5"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 sm:grid-cols-3 items-start justify-between gap-8 lg:col-span-3">
            {(['company', 'features', 'legal'] as const).map(
              (section) => (
                <div key={section} className="w-full">
                  <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                  <ul className="space-y-3">
                    {footerNav[section].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="container m-auto flex flex-col items-center justify-between gap-4 p-4 border-t text-xs md:flex-row md:px-0 md:text-sm">
          <p className="text-muted-foreground">
            &copy; {currentYear} Wisdomis.fun | All rights reserved
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
             <span>Made with ❤️ by Arshad</span>
          </div>
        </div>
    </footer>
  );
}
