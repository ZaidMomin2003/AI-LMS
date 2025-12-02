
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gem, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSignUpClick = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full p-8 text-center bg-background/80 backdrop-blur-md">
        <DialogHeader className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-headline font-bold text-foreground">
                Limited Time: Lifetime Deal
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
                Get unlimited access forever for a single payment of
            </DialogDescription>
            <p className="text-5xl font-bold font-headline text-primary">$999</p>
        </DialogHeader>
        
        <Button asChild size="lg" className="w-full mt-6" onClick={handleSignUpClick}>
            <Link href="/#pricing">
                Get Lifetime Access <Gem className="ml-2 w-4 h-4" />
            </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
