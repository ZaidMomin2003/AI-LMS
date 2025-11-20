
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, BookOpenCheck, LayoutDashboard, Heart } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
    { name: 'Features', href: '/#features' },
    { name: 'Stories', href: '/stories' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Institution', href: '/business' },
];

const TARGET_TEXT = "Dashboard";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const ScrambleDashboardButton = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];
          return randomChar;
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setText(TARGET_TEXT);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="group relative overflow-hidden rounded-md border-[1px] border-primary/50 bg-primary/90 text-primary-foreground transition-colors hover:border-primary"
    >
       <Link href="/dashboard" className="relative z-10 flex items-center gap-2 px-3 py-1.5 font-mono text-sm font-medium uppercase">
         <LayoutDashboard className="h-4 w-4" />
         <span>{text}</span>
       </Link>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-primary/0 from-40% via-primary/100 to-primary/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.div>
  );
};


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { user, loading } = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };
  
  const headerStyle = {
    backdropFilter: isScrolled ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
    backgroundColor: isScrolled
        ? theme === 'dark'
        ? 'hsl(var(--background) / 0.6)'
        : 'hsl(var(--background) / 0.6)'
        : 'transparent',
    borderBottom: isScrolled ? '1px solid hsl(var(--border) / 0.4)' : '1px solid transparent'
  };


  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: 'auto' },
  };


  return (
    <Dialog>
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="bg-blue-600 text-white text-center text-sm py-1">
                We're thrilled to be backed by{' '}
                <DialogTrigger asChild>
                    <span className="font-semibold underline cursor-pointer hover:opacity-80 transition-opacity">AWS Startups</span>
                </DialogTrigger>
                ! 🎉
            </div>
            <motion.header
            className="relative transition-all duration-300"
            variants={headerVariants}
            initial="initial"
            animate={'animate'}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={headerStyle}
            >
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                            <BookOpenCheck className="h-5 w-5" />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="font-bold font-headline text-lg -mb-1">Wisdom</span>
                            <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                        </div>
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden items-center justify-center md:flex">
                    <div className="flex items-center space-x-2 rounded-full border bg-background/70 px-3 py-1.5 shadow-sm">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                target={item.external ? '_blank' : undefined}
                                rel={item.external ? 'noopener noreferrer' : undefined}
                                className={cn(
                                    "rounded-full px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center justify-end space-x-2">
                <div className="hidden md:flex">
                    {!loading && (
                    user ? <ScrambleDashboardButton /> : <Button asChild><Link href="/signup">Get Started</Link></Button>
                    )}
                </div>
                <motion.button
                    className="hover:bg-muted rounded-lg p-2 transition-colors duration-200 md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileTap={{ scale: 0.95 }}
                >
                    {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                    ) : (
                    <Menu className="h-6 w-6" />
                    )}
                </motion.button>
                </div>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                    className="overflow-hidden md:hidden"
                    variants={mobileMenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                    <div className="border-t border-border/40 bg-background/95 mt-0 space-y-2 py-4 px-4 shadow-xl">
                        {!loading && (
                            <div className="px-4 py-3">
                                {user ? (
                                    <Button asChild className="w-full">
                                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full">
                                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                            Get Started
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                        {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="text-foreground hover:bg-muted block px-4 py-3 font-medium transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                        ))}
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.header>
        </div>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                    <Image src="/AWS.jpg" alt="AWS Startups Logo" layout="fill" objectFit="cover" />
                </div>
                <DialogTitle className="text-2xl font-headline text-center">A Partnership for Innovation</DialogTitle>
                <DialogDescription className="text-center text-base pt-2">
                    We are incredibly grateful to be supported by AWS Startups. This partnership provides us with the resources and scalability to pursue our mission: making education accessible and effective for everyone, everywhere. Thank you, Amazon, for believing in our vision!
                </DialogDescription>
            </DialogHeader>
            <div className="text-center pt-2">
                 <p className="text-sm font-medium flex items-center justify-center gap-2">Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> on AWS</p>
            </div>
        </DialogContent>
    </Dialog>
  );
}
