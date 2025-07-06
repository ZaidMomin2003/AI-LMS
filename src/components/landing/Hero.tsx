'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { FloatingIcons } from './FloatingIcons';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function Hero() {
  const router = useRouter();
  const [topic, setTopic] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/signup');
  };

  return (
    <section className="relative text-center overflow-hidden">
      <FloatingIcons />
      <div aria-hidden="true" className="absolute inset-0 top-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] animate-grid-pan" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] bg-[radial-gradient(ellipse_at_bottom,rgba(179,102,255,0.3)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 text-center sm:py-32">
        <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-20 duration-1000 delay-300">
          <Link href="/signup" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border px-4 py-1.5 text-sm text-muted-foreground shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-primary/30">
            <span className="absolute h-0 w-0 rounded-full bg-primary/30 transition-all duration-300 ease-in-out group-hover:h-56 group-hover:w-56"></span>
            <span className="relative z-10 flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-primary" /> Announcing ScholarAI 2.0 &ndash; Start Learning Smarter
            </span>
          </Link>
        </div>
        <h1 className="text-5xl font-headline font-bold tracking-tight text-foreground sm:text-7xl animate-in fade-in slide-in-from-top-12 duration-1000">
          From Topic to <span className="text-primary">Mastery</span>, <span className="text-primary">Instantly</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-top-16 duration-1000 delay-200">
          Stop drowning in textbooks. ScholarAI transforms any subject into clear study notes, interactive flashcards, and challenging quizzes, all in one click. Your smarter, faster learning journey starts here.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 animate-in fade-in slide-in-from-top-20 duration-1000 delay-300">
          <Button asChild size="sm">
            <Link href="/signup">
              Start Learning for Free
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="#features">
              Explore Features <span aria-hidden="true">→</span>
            </a>
          </Button>
        </div>
        <div className="relative mt-20 flow-root animate-in fade-in slide-in-from-top-24 duration-1000 delay-400">
          
          <Card className="max-w-4xl mx-auto p-4 rounded-xl bg-card/60 backdrop-blur-sm shadow-2xl shadow-primary/10 border-2 border-primary/10 transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.02]">
            <form onSubmit={handleGenerate}>
              <div className="rounded-lg border bg-background/80 shadow-inner">
                  <div className="flex items-center gap-2 p-3 border-b">
                    <Bot className="text-primary h-6 w-6"/>
                    <p className="text-md font-medium text-foreground">What topic do you want to master today?</p>
                </div>
                <div className="p-4">
                    <Input
                      placeholder="e.g., The Industrial Revolution"
                      className="text-lg font-mono bg-transparent"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      required
                    />
                </div>
                <div className="px-4 pb-4 flex justify-end">
                    <Button type="submit">Generate Materials <Sparkles className="ml-2" /></Button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-left">
              <Card className="bg-background/80 p-3">
                <CardContent className="p-1">
                  <CheckCircle2 className="text-green-500 mb-2"/>
                  <h3 className="font-semibold">Generated Notes</h3>
                  <p className="text-xs text-muted-foreground">Structured markdown ready.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 p-3">
                <CardContent className="p-1">
                  <CheckCircle2 className="text-green-500 mb-2"/>
                  <h3 className="font-semibold">Generated Flashcards</h3>
                  <p className="text-xs text-muted-foreground">10 terms & definitions.</p>
                </CardContent>
              </Card>
                <Card className="bg-background/80 p-3">
                <CardContent className="p-1">
                  <CheckCircle2 className="text-green-500 mb-2"/>
                  <h3 className="font-semibold">Generated Quiz</h3>
                  <p className="text-xs text-muted-foreground">5 multiple-choice questions.</p>
                </CardContent>
              </Card>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
