
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gem, PartyPopper, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const year = new Date().getFullYear();
        const difference = +new Date(`12/10/${year}`) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft as {days: number, hours: number, minutes: number, seconds: number};
    };

    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!timeLeft) {
        return null;
    }
    
    const timeUnits: {unit: 'days' | 'hours' | 'minutes' | 'seconds', label: string}[] = [
        { unit: 'days', label: 'Days' },
        { unit: 'hours', label: 'Hours' },
        { unit: 'minutes', label: 'Mins' },
        { unit: 'seconds', label: 'Secs' },
    ];

    return (
        <div className="flex justify-center items-start gap-3">
            {timeUnits.map(({ unit, label }) => (
                <div key={label} className="flex flex-col items-center">
                    <div className="text-3xl font-bold font-mono text-foreground bg-white/50 dark:bg-black/20 border border-border/50 rounded-lg w-16 py-2">
                        {String(timeLeft[unit] || 0).padStart(2, '0')}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1.5">{label}</span>
                </div>
            ))}
        </div>
    );
};


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
      <DialogContent className="max-w-md w-full p-0 text-center bg-card text-card-foreground rounded-2xl border-border/50 overflow-hidden">
        
        <div className="relative isolate p-8">
             <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 h-48 transform-gpu overflow-hidden blur-3xl"
              >
                <div
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
            </div>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                <PartyPopper className="w-8 h-8" />
            </div>

            <DialogHeader className="space-y-2">
                <DialogTitle className="text-3xl font-headline font-bold">
                    Limited Time: Lifetime Deal
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                    Get unlimited access forever for a single payment.
                </DialogDescription>
            </DialogHeader>

            <div className="my-8">
                <CountdownTimer />
            </div>
            
            <div className="flex flex-col gap-3">
                <p className="text-5xl font-bold font-headline text-primary">$999</p>
                <Button asChild size="lg" className="w-full mt-2" onClick={handleSignUpClick}>
                    <Link href="/#pricing">
                        <Gem className="mr-2 h-4 w-4" />
                        Claim Lifetime Access
                    </Link>
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
