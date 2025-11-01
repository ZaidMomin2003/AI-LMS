'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PenSquare, Sparkles, FileText, BrainCircuit, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const KeyTerm = ({ term, definition }: { term: string; definition: string }) => (
    <Popover>
        <PopoverTrigger asChild>
            <span className="text-primary font-semibold cursor-pointer hover:underline">
            {term}
            </span>
        </PopoverTrigger>
        <PopoverContent className="w-64 z-20">
            <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none font-headline">
                {term}
                </h4>
                <p className="text-sm text-muted-foreground">
                {definition}
                </p>
            </div>
            </div>
        </PopoverContent>
    </Popover>
);

const FlippableCard = () => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  // Auto-flip for demo
  useEffect(() => {
    const timer = setInterval(() => setIsFlipped(f => !f), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full perspective-1000">
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer',
          { 'rotate-y-180': isFlipped }
        )}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="h-full flex items-center justify-center p-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
            <h4 className="font-headline text-xl">Photosynthesis</h4>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="h-full flex items-center justify-center p-6 bg-primary text-primary-foreground shadow-lg shadow-primary/50">
            <p className="text-sm text-center">The process by which green plants use sunlight to synthesize foods from carbon dioxide and water.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const QuizCard = () => {
    return (
        <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10">
            <CardContent className="p-2 space-y-3">
                <p className="font-semibold text-sm">What is the powerhouse of the cell?</p>
                <div className="flex items-center space-x-3 rounded-md border p-3 bg-background/50 text-xs">
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground"/>
                    <p>Nucleus</p>
                </div>
                 <div className="flex items-center space-x-3 rounded-md border p-3 bg-background/50 text-xs border-primary bg-primary/10">
                    <div className="h-3 w-3 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"/>
                    </div>
                    <p className="font-semibold">Mitochondria</p>
                </div>
            </CardContent>
        </Card>
    );
};

const features = [
    {
        step: 'Step 1',
        title: "Enter Your Topic",
        content: "Start by telling our AI what you want to learn. It can be anything from 'The Industrial Revolution' to 'Quantum Entanglement'.",
        icon: <PenSquare className="text-primary h-6 w-6" />,
        demo: (
            <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10">
                <CardContent className="p-2 space-y-3">
                    <Input placeholder="e.g., The Renaissance" className="pointer-events-none" />
                    <Button className="w-full pointer-events-none">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Materials
                    </Button>
                </CardContent>
            </Card>
        )
    },
    {
        step: 'Step 2',
        title: "Get Detailed Notes",
        content: "The AI instantly structures the topic into comprehensive notes, identifying and defining key terms for you.",
        icon: <FileText className="text-primary h-6 w-6" />,
        demo: (
             <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10">
                <CardHeader className="p-2 border-b">
                    <p className="font-mono text-sm"># The Renaissance</p>
                </CardHeader>
                <CardContent className="p-2 space-y-2 text-sm text-muted-foreground">
                    <p className="font-mono">* Rebirth of art & science</p>
                    <p className="font-mono">* Focus on <KeyTerm term="Humanism" definition="An intellectual movement that emphasized human potential." /></p>
                </CardContent>
            </Card>
        )
    },
    {
        step: 'Step 3',
        title: "Master with Flashcards",
        content: "Solidify your knowledge. Key concepts are automatically converted into interactive flashcards for effective recall.",
        icon: <BrainCircuit className="text-primary h-6 w-6" />,
        demo: (
            <div className="w-full h-32">
                <FlippableCard />
            </div>
        )
    },
    {
        step: 'Step 4',
        title: "Test Your Knowledge",
        content: "Finally, take a custom-generated quiz to test your understanding and ensure the information is locked in.",
        icon: <CheckCircle className="text-primary h-6 w-6" />,
        demo: <QuizCard />
    }
];

export function Workflow() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

   useEffect(() => {
     const timer = setInterval(() => {
       setProgress(prev => {
         if (prev >= 100) {
           setCurrentFeature(cf => (cf + 1) % features.length);
           return 0;
         }
         return prev + 100 / (4000 / 100);
       });
     }, 100);
     return () => clearInterval(timer);
   }, []);

  return (
    <div className={'p-8 md:p-12'}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative mx-auto mb-12 max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl font-headline">
              Your Path to Mastery in Minutes
            </h2>
            <p className="text-muted-foreground mt-3">
              Wisdomis Fun streamlines your entire learning process from a single prompt to deep understanding.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background: 'linear-gradient(152.92deg, hsl(var(--primary) / 0.2) 4.54%, hsl(var(--primary) / 0.26) 34.2%, hsl(var(--primary) / 0.1) 77.55%)',
            }}
          ></div>
        </div>
        <hr className="bg-foreground/10 mx-auto mb-10 h-px w-1/2" />

        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-10">
          <div className="order-2 space-y-8 md:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8 cursor-pointer"
                onClick={() => setCurrentFeature(index)}
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.3,
                  x: 0,
                  scale: index === currentFeature ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 md:h-14 md:w-14',
                    index === currentFeature
                      ? 'border-primary bg-primary/10 text-primary scale-110 [box-shadow:0_0_15px_hsl(var(--primary)/0.3)]'
                      : 'border-muted-foreground/30 bg-muted',
                  )}
                >
                  {feature.icon}
                </motion.div>
                 <div className="flex-1">
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              'border-primary/20 relative order-1 h-[250px] overflow-hidden rounded-xl border [box-shadow:0_5px_30px_-15px_hsl(var(--primary)/0.3)] md:order-2 md:h-[300px] lg:h-[400px]',
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 overflow-hidden rounded-lg p-4 flex items-center justify-center"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <div className="w-full max-w-sm">
                        {feature.demo}
                      </div>
                      <div className="from-background via-background/50 absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t to-transparent" />
                       <div className="bg-background/80 absolute bottom-4 left-4 rounded-lg p-2 backdrop-blur-sm">
                        <span className="text-primary text-xs font-medium">
                          {feature.step}
                        </span>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
