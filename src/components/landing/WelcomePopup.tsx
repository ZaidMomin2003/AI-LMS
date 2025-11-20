
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, PartyPopper, CheckCircle, X, Sparkles, BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const includedFeatures = [
  'AI-Generated Notes & Summaries',
  'Interactive Flashcards',
  'Personalized Quizzes',
  'AI-Powered Study Roadmaps',
];

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Popup will show 2.5 seconds after every page load.
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
        {/* Left Side - Visual */}
        <div className="relative hidden md:flex flex-col items-center justify-center p-8 text-primary-foreground overflow-hidden">
             <Image
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop"
                alt="Library background"
                layout="fill"
                objectFit="cover"
                className="z-0"
                data-ai-hint="library books"
             />
             <div className="absolute inset-0 bg-primary/90 z-10"></div>
             <div className="relative z-20 text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm border border-primary-foreground/20">
                    <Sparkles className="w-12 h-12 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-headline font-bold">Your Study Superpower</h2>
                <p className="text-primary-foreground/80 max-w-xs mx-auto">
                    Unlock a smarter way to learn and conquer your exams with the power of AI.
                </p>
             </div>
        </div>
        
        {/* Right Side - Content */}
        <div className="relative p-8 flex flex-col justify-center">
            
            <div className="w-full max-w-sm mx-auto text-center md:text-left">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline font-bold text-foreground">Start Your Free Trial</DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2 mb-6">
                      Join thousands of students learning faster. Your first topic generation is on us.
                  </DialogDescription>
                </DialogHeader>
                
                <ul className="space-y-3 text-left mb-8">
                    {includedFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>
                
                <Button asChild size="lg" className="w-full" onClick={handleSignUpClick}>
                    <Link href="/signup">
                        Start Learning Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
