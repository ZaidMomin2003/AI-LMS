
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, PartyPopper, CheckCircle } from 'lucide-react';
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
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            handleClose();
        }
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-primary/20 shadow-2xl shadow-primary/20">
        <div className="relative p-8 bg-card text-center space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent" />
            
            <div className="mx-auto w-fit bg-primary/10 text-primary p-3 rounded-full">
                <PartyPopper className="w-8 h-8" />
            </div>

            <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-headline font-bold">Unlock Your Study Superpowers</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    Start your <span className="font-semibold text-primary">Free Trial</span> and get instant access to our full suite of AI tools.
                </DialogDescription>
            </DialogHeader>

            <div className="text-left space-y-2 py-2">
                 {includedFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                    </div>
                ))}
            </div>

            <Button asChild size="lg" className="w-full" onClick={handleSignUpClick}>
                 <Link href="/signup">
                    Claim Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </Button>
            
            <p className="text-xs text-muted-foreground">No credit card required. Ever.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
