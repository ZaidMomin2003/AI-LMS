
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
    account: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Login', href: '/login' },
      { name: 'Sign Up', href: '/signup' },
    ],
    company: [
      { name: 'About', href: '/developer' },
      { name: 'Institution', href: '/business' },
      { name: 'Invitation', href: '/invitation' },
      { name: 'Contact', href: '/#contact' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Delivery Policy', href: '/delivery' },
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
             <div className="w-full max-w-md space-y-3">
              <h4 className="text-sm font-medium">Have an idea?</h4>
              <p className="text-sm text-muted-foreground">
                Help us shape the future of learning. Share your feature requests or see what's coming next.
              </p>
              <div className="flex gap-2 pt-2">
                 <Button asChild variant="outline" size="sm">
                    <Link href="/roadmap">
                        View Roadmap
                    </Link>
                </Button>
                 <Button asChild variant="default" size="sm">
                    <a href="https://wa.link/o0dcmr" target="_blank" rel="noopener noreferrer">
                        Request a Feature
                    </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 sm:grid-cols-3 items-start justify-between gap-8 lg:col-span-3">
            {(['account', 'company', 'legal'] as const).map(
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
