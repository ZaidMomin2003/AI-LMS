
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, FileText, MessageCircleQuestion, Bot, Map, ClipboardCheck, Timer, Camera, Sparkles, CheckCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const features: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: Sparkles,
    title: 'AI Content Generation',
    description: "The core of ScholarAI. Enter any topic and instantly receive detailed study notes, interactive flashcards, and a challenging quiz.",
  },
  {
    icon: FileText,
    title: 'Interactive Study Notes',
    description: "Go beyond static text. Notes include pop-up definitions for key terms, making complex subjects easier to understand.",
  },
  {
    icon: BrainCircuit,
    title: 'Flippable Flashcards',
    description: "Reinforce your memory with active recall. Key terms and definitions are automatically turned into a deck of virtual, flippable flashcards.",
  },
  {
    icon: MessageCircleQuestion,
    title: 'Automated Quizzes',
    description: "Test your knowledge with custom-generated multiple-choice quizzes, complete with instant feedback and explanations for each answer.",
  },
  {
    icon: Bot,
    title: 'SageMaker AI Assistant',
    description: "Your personal 24/7 AI tutor. Ask follow-up questions, get simplified explanations, or upload images for context-aware help.",
  },
  {
    icon: Map,
    title: 'AI Study Roadmap',
    description: "Feeling overwhelmed? Paste your syllabus, set a deadline, and let AI generate a personalized, day-by-day study plan.",
  },
  {
    icon: ClipboardCheck,
    title: 'Kanban Study Plan Board',
    description: "Visualize your workflow. Add custom tasks, set priorities, and drag-and-drop them from 'To Do' to 'Completed' to track your progress.",
  },
  {
    icon: Camera,
    title: 'Capture the Answer',
    description: "Stuck on a problem from a textbook or worksheet? Just snap a photo, and the AI will provide a step-by-step solution.",
  },
  {
    icon: Timer,
    title: 'Pomodoro & Exam Timers',
    description: "Boost your focus with the integrated Pomodoro timer for structured study sessions, and keep an eye on your goal with the exam countdown timer.",
  },
];


const FeatureItem = ({ icon, title, description }: { icon: IconComponent; title: string; description: string; }) => {
    const Icon = icon;
    return (
        <li className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full mt-1">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </li>
    )
};


export default function AboutPage() {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        About ScholarAI
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        ScholarAI is an all-in-one learning platform designed to make studying smarter, not harder. Here are the powerful features at your disposal.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="font-headline">Core Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-6">
                            {features.map((feature) => (
                                <FeatureItem key={feature.title} {...feature} />
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
