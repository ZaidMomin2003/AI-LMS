'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, BookOpenCheck, LayoutDashboard, Heart, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const navItems = [
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Stories', href: '/stories' },
  { name: 'Roadmap', href: '/roadmap' },
];

const institutionNavItems = [
  { name: 'For Business', href: '/business' },
  { name: 'Invitation', href: '/invitation' },
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
          if (pos / CYCLES_PER_LETTER > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setText(TARGET_TEXT);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="group relative overflow-hidden rounded-xl bg-primary px-4 py-2 shadow-lg shadow-primary/20 transition-all"
    >
      <Link href="/dashboard" className="relative z-10 flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-white">
        <LayoutDashboard className="h-4 w-4" />
        <span>{text}</span>
      </Link>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Dialog>
      <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 pointer-events-auto">
          {/* Subtle Top Banner */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-2xl">
            <Sparkles className="h-3 w-3 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Backed by{' '}
              <DialogTrigger className="text-white hover:text-primary transition-colors">AWS Startups</DialogTrigger>
              {' '}• Serving 10k+ Scholars
            </p>
          </div>

          {/* Main Nav Container */}
          <motion.header
            className={cn(
              "w-full flex items-center justify-between px-6 h-16 rounded-2xl transition-all duration-500 border",
              isScrolled
                ? "bg-black/40 backdrop-blur-2xl border-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
                : "bg-transparent border-transparent"
            )}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <BookOpenCheck className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-headline font-black text-xl tracking-tighter text-white leading-none">WISDOM</h1>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Mastery AI</p>
              </div>
            </Link>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-center min-w-[80px]"
                >
                  {item.name}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1 outline-none">
                  Institution
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white p-2 rounded-xl">
                  {institutionNavItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild className="rounded-lg focus:bg-primary/10 focus:text-primary">
                      <Link href={item.href} className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider p-3">
                        {item.name}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {!loading && (
                user ? (
                  <ScrambleDashboardButton />
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login" className="hidden sm:block text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors px-4">
                      Login
                    </Link>
                    <Button asChild className="h-10 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold px-6">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                )
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden h-10 w-10 flex items-center justify-center text-white"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </motion.header>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[90] bg-black/60 md:hidden flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {[...navItems, ...institutionNavItems].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-headline font-black text-white hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-6 border-t border-zinc-800">
                {user ? (
                  <Button asChild className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>DASHBOARD</Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-lg">
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>GET STARTED</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AWS Partnership Dialog Content */}
      <DialogContent className="max-w-md bg-[#121214] border-zinc-800 text-white rounded-[2.5rem] p-8">
        <DialogHeader className="items-center text-center">
          <div className="relative h-24 w-full mb-6 rounded-2xl overflow-hidden bg-black flex items-center justify-center p-6">
            <Sparkles className="absolute top-2 right-2 h-4 w-4 text-primary animate-pulse" />
            <Image src="/AWS.jpg" alt="AWS Startups Logo" width={200} height={40} className="object-contain" />
          </div>
          <DialogTitle className="text-3xl font-headline font-black tracking-tight mb-4">A Global Partnership</DialogTitle>
          <DialogDescription className="text-zinc-400 text-base leading-relaxed">
            Wisdom AI is proud to be part of the AWS Startups ecosystem. This infrastructure allows our AI models to scale instantly, ensuring your study sessions are fast, secure, and always available.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            Built with <Heart className="w-3 h-3 text-primary fill-current" /> on AWS Infrastructure
          </p>
          <Button variant="outline" className="w-full rounded-2xl border-zinc-800 text-zinc-400 hover:text-white transition-all bg-transparent" onClick={() => { }}>
            Close Information
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
