'use client';

import React, { useState } from 'react';
import { BrainCircuit, FileText, MessageCircleQuestion, Bot, Map, ClipboardCheck, Timer, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function FeatureFlashcard() {
  return (
    <div className="group w-full max-w-xs h-48 perspective-1000">
      <div className="relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <Card className="h-full flex flex-col justify-between p-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
            <h4 className="font-headline text-2xl">Humanism</h4>
            <p className="text-right text-accent font-semibold">Term</p>
          </Card>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="h-full flex flex-col justify-between p-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
            <p className="text-sm">An outlook attaching prime importance to human rather than divine or supernatural matters.</p>
            <p className="text-right text-accent font-semibold">Definition</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

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

const RadioOption = ({ text, selectedOption, correctAnswer, onSelect }: { text: string; selectedOption: string | null; correctAnswer: string; onSelect: (option: string) => void; }) => {
    const isSelected = selectedOption === text;
    const isCorrect = text === correctAnswer;

    let stateVariant = "bg-background/50 hover:bg-secondary/50";
    if (selectedOption) {
        if (isSelected && isCorrect) {
            stateVariant = "border-green-500 bg-green-500/10 text-foreground";
        } else if (isSelected && !isCorrect) {
            stateVariant = "border-red-500 bg-red-500/10 text-foreground";
        } else if (isCorrect) {
            stateVariant = "border-green-500/50 bg-green-500/5 text-muted-foreground";
        } else {
             stateVariant = "border-border bg-background/30 text-muted-foreground opacity-60";
        }
    }
    
    return (
        <div 
            className={cn(
                "flex items-center space-x-3 rounded-md border p-3 transition-all cursor-pointer",
                stateVariant
            )}
            onClick={() => onSelect(text)}
        >
            <div className={cn(
                "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors",
                 isSelected ? "border-primary" : "border-muted-foreground"
            )}>
                {isSelected && <div className="h-2 w-2 rounded-full bg-primary"/>}
            </div>
            <p className="flex-1">{text}</p>
        </div>
    );
  };

function InteractiveQuiz() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const correctAnswer = "Niccolò Machiavelli";
  const options = ["Leonardo da Vinci", "Niccolò Machiavelli", "Galileo Galilei", "Dante Alighieri"];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10 transition-transform duration-300 hover:scale-105">
        <CardContent className="p-2 space-y-3">
            <p className="font-semibold">Who wrote "The Prince"?</p>
            {options.map((option) => (
                <RadioOption 
                    key={option} 
                    text={option}
                    selectedOption={selectedOption}
                    correctAnswer={correctAnswer}
                    onSelect={handleSelectOption}
                />
            ))}
             {selectedOption && selectedOption !== correctAnswer && (
                 <p className="text-sm text-red-400/90 pt-2 font-medium">Not quite. The correct answer is highlighted in green.</p>
            )}
            {selectedOption === correctAnswer && (
                 <p className="text-sm text-green-400/90 pt-2 font-medium">Correct! Well done.</p>
            )}
        </CardContent>
    </Card>
  )
}


function SageMakerDemo() {
  return (
    <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10 transition-transform duration-300 hover:scale-105">
      <CardContent className="p-2 space-y-3">
        <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Bot size={20}/>
            </div>
            <div className="rounded-2xl p-3 bg-secondary rounded-bl-none max-w-[80%]">
                <p className="text-sm">I can help with any topic! What are you curious about?</p>
            </div>
        </div>
        <div className="flex items-start gap-3 justify-end">
            <div className="rounded-2xl p-3 bg-primary text-primary-foreground rounded-br-none max-w-[80%]">
                <p className="text-sm">What's the main cause of the French Revolution?</p>
            </div>
             <div className="bg-muted text-muted-foreground rounded-full p-2">
                <User size={20}/>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Bot size={20}/>
            </div>
            <div className="rounded-2xl p-3 bg-secondary rounded-bl-none max-w-[80%]">
                <p className="text-sm">It was a perfect storm of social inequality, economic crisis, and Enlightenment ideas!</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RoadmapDemo() {
    return (
        <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10 transition-transform duration-300 hover:scale-105">
            <CardHeader className="p-2 border-b">
                <p className="font-bold font-headline">AI-Generated Study Roadmap</p>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
                <Card className="bg-background/80 p-3">
                    <p className="text-sm font-bold">Day 1: Nov 4, 2024</p>
                    <p className="text-xs text-muted-foreground">Intro to Quantum Mechanics</p>
                </Card>
                <Card className="bg-background/80 p-3">
                    <p className="text-sm font-bold">Day 2: Nov 5, 2024</p>
                    <p className="text-xs text-muted-foreground">Wave-Particle Duality & Uncertainty Principle</p>
                </Card>
                 <Card className="bg-background/80 p-3 opacity-50">
                    <p className="text-sm font-bold">Day 3: Nov 6, 2024</p>
                    <p className="text-xs text-muted-foreground">Schrödinger Equation</p>
                </Card>
            </CardContent>
        </Card>
    );
}

function StudyPlanDemo() {
    const DemoTask = ({ title }: { title: string }) => (
        <div className="p-2 mb-2 bg-secondary rounded-md shadow-sm">
            <p className="text-xs">{title}</p>
        </div>
    );
    return (
        <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10 transition-transform duration-300 hover:scale-105">
            <div className="flex gap-2">
                <div className="flex-1 bg-background/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-center mb-2">To Do</p>
                    <DemoTask title="Read Chapter 5" />
                    <DemoTask title="Summarize notes" />
                </div>
                 <div className="flex-1 bg-background/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-center mb-2">In Progress</p>
                    <DemoTask title="Practice problems" />
                </div>
                 <div className="flex-1 bg-background/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-center mb-2">Done</p>
                    <DemoTask title="Review Chapter 4" />
                </div>
            </div>
        </Card>
    );
}

function ExamTimerDemo() {
    const TimeCard = ({ value, unit }: { value: string, unit: string }) => (
        <div className="flex flex-col items-center bg-background/80 p-2 rounded-lg flex-1">
            <div className="text-2xl font-bold font-mono text-primary">{value}</div>
            <div className="text-xs uppercase tracking-wider mt-1 text-muted-foreground">{unit}</div>
        </div>
    )
    return (
        <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10 transition-transform duration-300 hover:scale-105">
            <CardHeader className="p-2 text-center">
                <p className="font-bold font-headline">Mid-Term Exam Countdown</p>
            </CardHeader>
            <CardContent className="p-2">
                <div className="flex justify-around text-center gap-2">
                    <TimeCard value="12" unit="Days" />
                    <TimeCard value="08" unit="Hrs" />
                    <TimeCard value="45" unit="Mins" />
                    <TimeCard value="22" unit="Secs" />
                </div>
            </CardContent>
        </Card>
    );
}

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Learn Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            A Toolkit for Total Understanding
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            ScholarAI deconstructs any topic into the core components you need to truly learn it, not just memorize it.
          </p>
        </div>
        
        {/* Feature 1: Notes */}
        <div className="mt-20 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="md:pr-8">
                <div className="flex items-center gap-2">
                   <FileText className="h-8 w-8 text-primary" />
                   <h3 className="text-2xl font-headline font-bold">Comprehensive Study Notes</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Tired of dense material? Our AI generates structured notes and automatically identifies key terms. Hover over highlighted words like{' '}
                    <KeyTerm term="Humanism" definition="An intellectual movement that emphasized human potential and achievements, rather than divine or supernatural matters." />
                    {' '}to get instant definitions, making complex topics easier to grasp.
                </p>
            </div>
            <div className="flex items-center justify-center">
                <Card className="w-full max-w-md bg-card/50 p-4 shadow-lg border-2 border-primary/10 transition-transform duration-300 hover:scale-105">
                    <CardHeader className="p-2 border-b">
                        <p className="font-mono text-sm"># The Renaissance</p>
                    </CardHeader>
                    <CardContent className="p-2 space-y-2 text-sm text-muted-foreground">
                        <p className="font-mono">## Key Characteristics</p>
                        <p className="font-mono">* Rebirth of art & science</p>
                        <p className="font-mono">* Focus on <KeyTerm term="Humanism" definition="An intellectual movement that emphasized human potential and achievements, rather than divine or supernatural matters." /></p>
                        <p className="font-mono">* Started in Florence, Italy</p>
                        <p className="font-mono mt-2">## Major Figures</p>
                        <p className="font-mono">* Leonardo da Vinci</p>
                        <p className="font-mono">* Michelangelo</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Feature 2: Flashcards */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
             <div className="flex items-center justify-center md:order-last">
                 <FeatureFlashcard />
            </div>
            <div className="md:pl-8">
                <div className="flex items-center gap-2">
                   <BrainCircuit className="h-8 w-8 text-accent" />
                   <h3 className="text-2xl font-headline font-bold">Interactive Flashcards</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Active recall is the secret to long-term retention. We automatically identify key terms and concepts from your topic and build a set of interactive flashcards. Test your memory, solidify your understanding, and master the vocabulary of your subject.
                </p>
            </div>
        </div>

        {/* Feature 3: Quizzes */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="md:pr-8">
                <div className="flex items-center gap-2">
                   <MessageCircleQuestion className="h-8 w-8 text-primary" />
                   <h3 className="text-2xl font-headline font-bold">Challenging Quizzes</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Put your knowledge to the test. ScholarAI generates custom multiple-choice quizzes that challenge you on the most important aspects of your topic. Get instant feedback on your answers to identify weak spots and confirm your mastery.
                </p>
            </div>
            <div className="flex items-center justify-center">
                 <InteractiveQuiz />
            </div>
        </div>
        
        {/* Feature 4: SageMaker */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="flex items-center justify-center md:order-last">
                <SageMakerDemo />
            </div>
            <div className="md:pl-8">
                <div className="flex items-center gap-2">
                    <Bot className="h-8 w-8 text-accent" />
                    <h3 className="text-2xl font-headline font-bold">SageMaker AI Assistant</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Stuck on a concept? Get instant, conversational help from your personal AI tutor. SageMaker can explain complex topics, answer follow-up questions, and even analyze images you upload to provide context-aware assistance.
                </p>
            </div>
        </div>

        {/* Feature 5: Roadmap */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="md:pr-8">
                <div className="flex items-center gap-2">
                    <Map className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-headline font-bold">Personalized Study Roadmap</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Feeling overwhelmed by a huge syllabus? Just paste your topics, set a target date, and let our AI build a custom, day-by-day study plan. It intelligently breaks down the work into manageable chunks to guide you to success.
                </p>
            </div>
            <div className="flex items-center justify-center">
                <RoadmapDemo />
            </div>
        </div>

        {/* Feature 6: Study Plan */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="flex items-center justify-center md:order-last">
                <StudyPlanDemo />
            </div>
            <div className="md:pl-8">
                <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-8 w-8 text-accent" />
                    <h3 className="text-2xl font-headline font-bold">Visual Study Plan Board</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Organize your study life. Our Kanban-style board lets you visualize your entire syllabus. Add custom tasks, prioritize what's important, and drag-and-drop your way from 'To Do' to 'Done'.
                </p>
            </div>
        </div>

        {/* Feature 7: Exam Timer */}
        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="md:pr-8">
                <div className="flex items-center gap-2">
                    <Timer className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-headline font-bold">Exam Countdown Timer</h3>
                </div>
                <p className="mt-4 text-lg text-muted-foreground">
                    Keep your eyes on the prize. Set a countdown for your next big exam to stay focused and motivated. Your target date will always be visible on your dashboard, reminding you of your goal.
                </p>
            </div>
            <div className="flex items-center justify-center">
                <ExamTimerDemo />
            </div>
        </div>

      </div>
    </section>
  );
}
