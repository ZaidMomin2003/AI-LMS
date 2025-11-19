
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, PartyPopper, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

const includedFeatures = [
  'AI-Generated Notes',
  'Interactive Flashcards',
  'Personalized Quizzes',
  'AI Study Roadmaps',
];

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const popupShown = sessionStorage.getItem('welcomePopupShown');
    
    if (!popupShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('welcomePopupShown', 'true');
    setIsOpen(false);
  };

  const handleSignUpClick = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-[#F8F5F1] dark:bg-zinc-900 border-none shadow-2xl rounded-2xl">
        <div className="relative p-8 text-center text-zinc-800 dark:text-zinc-200 space-y-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/5 hover:bg-black/10 text-zinc-600 dark:bg-white/10 dark:hover:bg-white/20 dark:text-zinc-400"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </Button>
          
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[120px] font-bold text-zinc-300/40 dark:text-zinc-700/40 opacity-50 select-none -z-10">
              FREE
            </span>
            <svg className="absolute top-10 left-12 w-20 h-20 text-red-400 opacity-80 -z-1" viewBox="0 0 100 100">
                <path d="M20,50 C40,20 60,80 80,50" stroke="currentColor" fill="none" strokeWidth="6" strokeLinecap="round" transform="rotate(-15)" />
                <path d="M75,53 L85,45 M80,50 L70,55" stroke="currentColor" fill="none" strokeWidth="6" strokeLinecap="round" />
            </svg>
             <svg className="absolute top-16 right-12 w-16 h-16 text-green-400 opacity-80 -z-1" viewBox="0 0 100 100">
                <path d="M20,20 C50,80 80,20 80,70" stroke="currentColor" fill="none" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative inline-block my-4">
              <svg className="w-32 h-32 text-primary" viewBox="0 0 100 100">
                <path d="M50,0 L61.2,38.8 L100,50 L61.2,61.2 L50,100 L38.8,61.2 L0,50 L38.8,38.8 Z" fill="currentColor"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">FREE</span>
              </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-bold text-zinc-900 dark:text-white">Your Free Trial Awaits!</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Sign up and save hours of studying.</p>
          </div>
          
          <div className="flex justify-center gap-2">
            <div className="bg-primary text-primary-foreground text-xl font-bold w-10 h-12 flex items-center justify-center rounded-lg">1</div>
            <div className="bg-primary text-primary-foreground text-xl font-bold w-10 h-12 flex items-center justify-center rounded-lg">0</div>
            <div className="bg-primary text-primary-foreground text-xl font-bold w-10 h-12 flex items-center justify-center rounded-lg">0</div>
          </div>

          <div className="space-y-4 pt-4">
            <ul className="text-left space-y-2 max-w-xs mx-auto">
               {includedFeatures.slice(0,2).map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                    </li>
                ))}
            </ul>
             <Button asChild size="lg" className="w-full max-w-xs" onClick={handleSignUpClick}>
                 <Link href="/signup">
                    Get Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
