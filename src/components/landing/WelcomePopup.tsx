
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gem, PartyPopper, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
                    <div className="text-3xl font-bold font-mono text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg w-16 py-2">
                        {String(timeLeft[unit] || 0).padStart(2, '0')}
                    </div>
                    <span className="text-xs text-white/80 mt-1.5">{label}</span>
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
        
        <div className="relative isolate text-white">
             <Image 
                src="https://images.unsplash.com/photo-1503944583220-79d6f827a1f7?q=80&w=800&auto=format&fit=crop"
                alt="Smiling child"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 -z-10"
                data-ai-hint="smiling child"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent -z-10"></div>
             <div className="p-8 pt-16">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-3xl font-headline font-bold text-white">
                        Limited Time: Lifetime Deal
                    </DialogTitle>
                    <DialogDescription className="text-base text-white/80">
                        Get unlimited access forever for a single payment.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-8">
                    <CountdownTimer />
                </div>
            </div>
        </div>
        
        <div className="p-8 pt-6 bg-card">
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

        <DialogClose className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white/80 hover:text-white transition-colors z-20">
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
