
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
        return null; // Or a loading skeleton
    }
    
    const formatTimeUnit = (unit: number) => String(unit).padStart(2, '0').split('');

    const timeUnits = {
        Days: formatTimeUnit(timeLeft.days),
        Hours: formatTimeUnit(timeLeft.hours),
        Minutes: formatTimeUnit(timeLeft.minutes),
        Seconds: formatTimeUnit(timeLeft.seconds),
    };

    return (
        <div className="flex justify-center items-start gap-3">
            {Object.entries(timeUnits).map(([label, digits]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-8 h-10 rounded-md bg-zinc-800 text-white flex items-center justify-center text-lg font-bold">{digits[0]}</div>
                        <div className="w-8 h-10 rounded-md bg-zinc-800 text-white flex items-center justify-center text-lg font-bold">{digits[1]}</div>
                    </div>
                    <span className="text-xs text-zinc-400">{label}</span>
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
      <DialogContent className="max-w-md w-full p-8 text-center bg-black text-white rounded-2xl border-zinc-800">
        <DialogClose className="absolute right-4 top-4 rounded-full bg-zinc-800/80 p-1.5 text-zinc-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
        </DialogClose>
        
        <DialogHeader className="space-y-4">
            <div className="relative h-24 w-full mb-4">
                {/* Graphic elements */}
                <div className="absolute -top-5 left-1/4 w-24 h-10 bg-yellow-400 text-black font-bold flex items-center justify-center -rotate-12 rounded-md">
                    LIFETIME
                </div>
                <div className="absolute top-0 right-1/4 w-20 h-9 bg-blue-500 text-white font-bold flex items-center justify-center rotate-6 rounded-md">
                    DEAL
                </div>
                <div className="absolute top-8 left-1/2 w-16 h-8 bg-pink-500 text-white font-bold flex items-center justify-center -rotate-6 rounded-md">
                    SALE
                </div>
                <Sparkles className="absolute top-[-10px] right-[30%] w-16 h-16 text-pink-400 -rotate-12" />
            </div>

            <DialogTitle className="text-3xl font-headline font-bold text-white">
                Lifetime Deal
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-base">
                Unlock unlimited access forever.
            </DialogDescription>
        </DialogHeader>

        <div className="my-8">
            <CountdownTimer />
        </div>
        
        <div className="flex flex-col gap-3">
             <p className="text-3xl font-bold font-headline text-primary">$999</p>
             <Button asChild size="lg" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSignUpClick}>
                <Link href="/#pricing">
                    Get Lifetime Access
                </Link>
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
