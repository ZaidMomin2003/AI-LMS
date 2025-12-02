
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gem, PartyPopper, X, Sparkles, CheckCircle } from 'lucide-react';
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
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl border-border/20">
        
        {/* Left Side: Image and Countdown */}
        <div className="relative isolate text-white flex flex-col justify-end">
             <Image 
                src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwa2lkc3xlbnwwfHx8fDE3NjQ2NjE2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Smiling child"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 -z-10"
                data-ai-hint="smiling child"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent -z-10"></div>
             <div className="p-8 text-center space-y-4">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-3xl font-headline font-bold text-white">
                        Limited Time: Lifetime Deal
                    </DialogTitle>
                    <DialogDescription className="text-base text-white/80">
                        Get unlimited access forever for a single payment.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                    <CountdownTimer />
                </div>
            </div>
        </div>
        
        {/* Right Side: Offer Details */}
        <div className="p-8 bg-card flex flex-col justify-center text-center">
            <div className="space-y-4">
                 <h3 className="text-xl font-semibold">The Ultimate Investment in Your Future</h3>
                <p className="text-sm text-muted-foreground">One-time payment, lifetime access.</p>
            </div>
            
            <div className="flex items-baseline justify-center gap-3 my-6">
                <span className="text-3xl font-semibold text-muted-foreground line-through decoration-2">$1990</span>
                <p className="text-5xl font-bold font-headline text-primary">$999</p>
            </div>
            
            <div className="hidden md:block text-left text-sm text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground text-center">What you get:</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Notes</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Quizzes</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Roadmaps</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> WisdomGPT AI</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> All Future Updates</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Priority Support</li>
                </ul>
            </div>

            <Button asChild size="lg" className="w-full mt-8" onClick={handleSignUpClick}>
                <Link href="/#pricing">
                    <Gem className="mr-2 h-4 w-4" />
                    Claim Lifetime Access
                </Link>
            </Button>
        </div>

        <DialogClose className="absolute right-4 top-4 rounded-full bg-black/50 p-1.5 text-white/80 hover:text-white transition-colors z-20">
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
