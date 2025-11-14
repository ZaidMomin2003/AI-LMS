'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';

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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-primary shadow-2xl shadow-primary/20">
        <div className="p-8 relative bg-card text-center space-y-4">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent to-primary" />
            
            <div className="mx-auto w-fit bg-primary/10 text-primary p-4 rounded-full">
                <PartyPopper className="w-10 h-10" />
            </div>

            <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-headline font-bold">Welcome to Wisdom! 🎉</DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground">
                    Start Your <span className="text-primary font-bold">Free Trial</span> Today
                </DialogDescription>
            </DialogHeader>

            <p className="text-muted-foreground">
                Join thousands of learners and see how AI can transform your studies.
            </p>

            <Button asChild size="lg" className="w-full" onClick={handleSignUpClick}>
                 <Link href="/signup">
                    Start My Free Trial <ArrowRight className="ml-2" />
                </Link>
            </Button>
            
            <p className="text-xs text-muted-foreground">No credit card required.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
