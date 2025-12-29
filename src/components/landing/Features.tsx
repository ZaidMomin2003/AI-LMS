
'use client';

import type React from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  BrainCircuit,
  MessageCircleQuestion,
  Bot,
  Map,
  ClipboardCheck,
  Timer,
  Camera,
  Sparkles,
  User,
  Lightbulb,
  PenSquare,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';

// --- Reusable Demo Components ---

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

const NotesAndExplainDemo = () => (
    <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10 h-full flex flex-col md:flex-row gap-4">
        <div className="flex-1">
            <CardHeader className="p-2 border-b">
                <p className="font-mono text-sm"># The Renaissance</p>
            </CardHeader>
            <CardContent className="p-2 space-y-2 text-sm text-muted-foreground">
                <p className="font-mono">* Rebirth of art & science</p>
                <p className="font-mono">* Focus on <KeyTerm term="Humanism" definition="An intellectual movement that emphasized human potential and achievements." /></p>
                <p className="font-mono">* Started in Italy, spread through Europe.</p>
            </CardContent>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-4">
                The process, known as <span className="bg-primary/20 text-primary rounded px-1">photosynthesis</span>, is crucial.
            </p>
            <Card className="p-3 bg-background text-xs w-full">
                <p className="font-bold flex items-center gap-1.5"><Lightbulb className="w-3 h-3 text-amber-400" />Explanation:</p>
                <p className="text-muted-foreground">The way plants use sunlight to create their own food from water and CO2.</p>
            </Card>
        </div>
    </Card>
);

const FlashcardDemo = () => {
    return (
        <div className="w-full h-full perspective-1000 group">
             <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                <div className="absolute w-full h-full backface-hidden">
                    <Card className="h-full flex flex-col justify-between p-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
                        <h4 className="font-headline text-2xl">Humanism</h4>
                        <p className="text-right text-primary font-semibold">Term</p>
                    </Card>
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                    <Card className="h-full flex flex-col justify-between p-6 bg-card/80 shadow-xl border-2 border-accent/20 backdrop-blur-sm">
                        <p className="text-sm">An outlook attaching prime importance to human rather than divine or supernatural matters.</p>
                        <p className="text-right text-primary font-semibold">Definition</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const QuizDemo = () => (
     <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10 h-full">
        <CardContent className="p-2 space-y-3">
            <p className="font-semibold text-sm">Who wrote "The Prince"?</p>
            <div className="flex items-center space-x-3 rounded-md border p-3 bg-background/50 text-xs">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground"/>
                <p>Leonardo da Vinci</p>
            </div>
            <div className="flex items-center space-x-3 rounded-md border p-3 bg-background/50 text-xs border-primary bg-primary/10">
                <div className="h-3 w-3 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"/>
                </div>
                <p className="font-semibold">Niccolò Machiavelli</p>
            </div>
        </CardContent>
    </Card>
);

const WisdomGptDemo = () => (
    <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10 h-full">
      <CardContent className="p-2 space-y-3">
        <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Bot size={20}/>
            </div>
            <div className="rounded-2xl p-3 bg-secondary rounded-bl-none max-w-[80%]">
                <p className="text-sm">What's the main cause of the French Revolution?</p>
            </div>
        </div>
        <div className="flex items-start gap-3 justify-end">
             <div className="rounded-2xl p-3 bg-primary text-primary-foreground rounded-br-none max-w-[80%]">
                <p className="text-sm">Social inequality & economic crisis!</p>
            </div>
             <div className="bg-muted text-muted-foreground rounded-full p-2">
                <User size={20}/>
            </div>
        </div>
      </CardContent>
    </Card>
);

const RoadmapDemo = () => (
    <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10 h-full">
        <CardHeader className="p-2 border-b">
            <p className="font-bold font-headline">AI Study Roadmap</p>
        </CardHeader>
        <CardContent className="p-2 space-y-2">
            <Card className="bg-background/80 p-3">
                <p className="text-sm font-bold">Day 1: Nov 4, 2024</p>
                <p className="text-xs text-muted-foreground">Intro to Quantum Mechanics</p>
            </Card>
            <Card className="bg-background/80 p-3 opacity-60">
                <p className="text-sm font-bold">Day 2: Nov 5, 2024</p>
                <p className="text-xs text-muted-foreground">Wave-Particle Duality</p>
            </Card>
        </CardContent>
    </Card>
);

const IntegratedToolsDemo = () => (
    <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10 h-full flex flex-col md:flex-row gap-4">
        <div className="grid grid-cols-2 gap-2 flex-1">
            <div>
                <p className="text-xs font-bold text-center mb-2">In Progress</p>
                <div className="p-2 bg-secondary rounded-md shadow-sm">
                    <p className="text-xs">Practice problems</p>
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-center mb-2">Completed</p>
                <div className="p-2 bg-green-500/20 text-green-300 rounded-md shadow-sm opacity-70">
                    <p className="text-xs line-through">Review Chapter 1</p>
                </div>
            </div>
        </div>
         <div className="w-px bg-border/50 hidden md:block" />
         <div className="h-px bg-border/50 md:hidden" />
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative">
                <p className="text-4xl font-bold font-mono text-primary">24:17</p>
                <div className="absolute -top-2 -right-4 bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">WORK</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pomodoro Session</p>
        </div>
    </Card>
);

const CaptureDemo = () => (
    <Card className="w-full bg-card/50 p-4 shadow-lg border-2 border-primary/10 h-full">
        <CardContent className="p-2 flex items-center justify-center gap-4 h-full">
            <div className="text-center">
                <Camera className="w-12 h-12 text-primary mx-auto"/>
                <p className="text-xs text-muted-foreground mt-2">Snap a photo of a problem</p>
            </div>
            <div className="text-primary animate-pulse">
                <Sparkles className="w-8 h-8"/>
            </div>
            <div className="bg-secondary p-3 rounded-lg flex-1">
                <p className="text-sm font-bold">Answer:</p>
                <p className="text-lg font-mono text-primary">x = 5</p>
            </div>
        </CardContent>
    </Card>
);

const PersonalizedNotesDemo = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
    {/* Step 1 */}
    <div className="flex flex-col items-center text-center">
      <div className="relative w-full">
        <div className="p-4 rounded-lg bg-card/60 border">
          <p className="text-xs font-bold mb-2">1. Personalize</p>
          <div className="space-y-3 text-left">
            <div>
              <Label className="text-xs text-muted-foreground">Style:</Label>
              <Select defaultValue="humorous">
                <SelectTrigger className="h-7 text-xs pointer-events-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="humorous">Humorous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
               <Label className="text-xs text-muted-foreground">Superpower:</Label>
                <Select defaultValue="laser-focus">
                <SelectTrigger className="h-7 text-xs pointer-events-none">
                  <SelectValue />
                </SelectTrigger>
                 <SelectContent>
                  <SelectItem value="laser-focus">Laser Focus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <ChevronRight className="w-6 h-6 text-muted-foreground my-4 hidden md:block mx-auto transform -rotate-90 md:rotate-0" />
      <ChevronRight className="w-6 h-6 text-muted-foreground my-4 md:hidden mx-auto transform rotate-90" />
    </div>
    {/* Step 2 */}
    <div className="flex flex-col items-center text-center">
      <div className="p-4 rounded-lg bg-card/60 border w-full">
        <p className="text-xs font-bold mb-2">2. Generate</p>
        <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs mt-2">Generating notes...</p>
        </div>
      </div>
       <ChevronRight className="w-6 h-6 text-muted-foreground my-4 hidden md:block mx-auto transform -rotate-90 md:rotate-0" />
      <ChevronRight className="w-6 h-6 text-muted-foreground my-4 md:hidden mx-auto transform rotate-90" />
    </div>
    {/* Step 3 */}
     <div className="flex flex-col items-center text-center">
      <div className="p-4 rounded-lg bg-card/60 border w-full h-full">
        <p className="text-xs font-bold mb-2">3. Master</p>
        <div className="text-left text-xs p-2 rounded-md bg-secondary/50">
            <h4 className="font-semibold text-sm">Intro for Captain!</h4>
            <p className="text-muted-foreground">Alright Captain, let's use that laser focus of yours to conquer Photosynthesis!</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Bento Grid Component ---

interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  demo: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
}

const bentoItems: BentoItem[] = [
  {
    title: 'Instant Explanations & Notes',
    description: "From dense text to structured, scannable notes with on-demand explanations for any term.",
    icon: <Sparkles className="text-primary h-4 w-4" />,
    demo: <NotesAndExplainDemo />,
    colSpan: 2,
    rowSpan: 1,
  },
  {
    title: 'WisdomGPT AI Assistant',
    description: 'Your personal AI tutor, ready to answer any question.',
    icon: <Bot className="text-primary h-4 w-4" />,
    demo: <WisdomGptDemo />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Interactive Flashcards',
    description: 'Master key terms with active recall.',
    icon: <BrainCircuit className="text-primary h-4 w-4" />,
    demo: <FlashcardDemo />,
    colSpan: 1,
    rowSpan: 1,
    className: "min-h-[15rem] md:min-h-0", // Set a min-height for mobile
  },
   {
    title: 'Challenging Quizzes',
    description: 'Test your understanding with custom quizzes.',
    icon: <MessageCircleQuestion className="text-primary h-4 w-4" />,
    demo: <QuizDemo />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Personalized Roadmap',
    description: 'Turn any syllabus into a day-by-day study plan.',
    icon: <Map className="text-primary h-4 w-4" />,
    demo: <RoadmapDemo />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Integrated Study Tools',
    description: 'Use Pomodoro timers and Kanban boards to stay on track.',
    icon: <Timer className="text-primary h-4 w-4" />,
    demo: <IntegratedToolsDemo />,
    colSpan: 2,
    rowSpan: 1,
  },
  {
    title: 'Capture the Answer',
    description: 'Snap a picture of a problem to get an instant solution.',
    icon: <Camera className="text-primary h-4 w-4" />,
    demo: <CaptureDemo />,
    colSpan: 1,
    rowSpan: 1,
  },
   {
    title: 'Your Notes, Your Way',
    description: 'Tell the AI your learning style. Get notes that are funny, formal, or anything in between.',
    icon: <PenSquare className="text-primary h-4 w-4" />,
    demo: <PersonalizedNotesDemo />,
    colSpan: 3,
    rowSpan: 1,
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
      </div>

       <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Learn Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            A Toolkit for Total Understanding
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            wisdom deconstructs any topic into the core components you need to truly learn it, not just memorize it.
          </p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
            {bentoItems.map((item, index) => (
            <motion.div
                key={`${item.title}-${index}`}
                className={cn(
                    'col-span-1',
                    item.colSpan === 2 && 'md:col-span-2',
                    item.colSpan === 3 && 'md:col-span-3',
                    item.rowSpan === 2 && 'md:row-span-2',
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
            >
                <Card className={cn("group bg-card/40 relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/60 overflow-hidden p-4 flex flex-col", item.className)}>
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                             <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                                {item.icon}
                            </div>
                            <h3 className="text-foreground text-[15px] font-medium tracking-tight">
                            {item.title}
                            </h3>
                        </div>
                    </div>
                     <p className="text-muted-foreground text-sm leading-relaxed mt-2 flex-shrink-0">{item.description}</p>
                     <div className="relative flex-1 mt-4">
                        {item.demo}
                     </div>
                </Card>
            </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
