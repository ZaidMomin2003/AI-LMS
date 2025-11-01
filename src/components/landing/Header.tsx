'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, BookOpenCheck, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/button';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
    { name: 'Features', href: '/#features' },
    { name: 'Use Cases', href: '/#use-cases' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Roadmap', href: 'https://scholar.featurebase.app/roadmap', external: true },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/#contact' },
];

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
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      variants={headerVariants}
      initial="initial"
      animate={'animate'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={headerStyle}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
             <Link href="/" className="mr-6 flex items-center space-x-2">
                <BookOpenCheck className="h-6 w-6 text-primary" />
                <span className="font-bold">Wisdomis Fun</span>
            </Link>
        </div>

        <nav className="hidden items-center space-x-6 text-sm md:flex">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                    {item.name}
                </Link>
            ))}
        </nav>

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
  );
}
