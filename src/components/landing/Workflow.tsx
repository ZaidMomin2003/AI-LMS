
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PenSquare, Sparkles, FileText, BrainCircuit, CheckCircle, ArrowRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React from 'react';

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
  return (
    <div className="w-full h-full perspective-1000" onClick={() => setIsFlipped(!isFlipped)} >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer',
          { 'rotate-y-180': isFlipped }
        )}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="h-full flex items-center justify-center p-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
            <h4 className="font-headline text-2xl">Photosynthesis</h4>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="h-full flex items-center justify-center p-6 bg-emerald-500 text-emerald-50 shadow-lg shadow-emerald-500/50">
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


const workflowSteps = [
    {
        icon: PenSquare,
        title: "1. Enter Your Topic",
        description: "Start by telling our AI what you want to learn. It can be anything from 'The Industrial Revolution' to 'Quantum Entanglement'.",
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
        icon: FileText,
        title: "2. Get Detailed Notes",
        description: "The AI instantly structures the topic into comprehensive notes, identifying and defining key terms for you.",
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
        icon: BrainCircuit,
        title: "3. Master with Flashcards",
        description: "Solidify your knowledge. Key concepts are automatically converted into interactive flashcards for effective recall.",
        demo: (
            <div className="w-full h-40">
                <FlippableCard />
            </div>
        )
    },
    {
        icon: CheckCircle,
        title: "4. Test Your Knowledge",
        description: "Finally, take a custom-generated quiz to test your understanding and ensure the information is locked in.",
        demo: <QuizCard />
    }
];

export function Workflow() {
    return (
        <section id="workflow" className="py-20 sm:py-32 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Your Path to Mastery in 4 Simple Steps
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        From a single prompt to deep understanding, see how Wisdomis Fun streamlines your entire learning process.
                    </p>
                </div>

                <div className="relative mt-16">
                    {/* Dashed line for desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-transparent">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,hsl(var(--border)),hsl(var(--border))_4px,transparent_4px,transparent_8px)]"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                        {workflowSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.title} className="flex flex-col items-center text-center lg:text-left lg:items-start relative">
                                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold font-headline">{step.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                                    <div className="mt-6 w-full max-w-xs">{step.demo}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
