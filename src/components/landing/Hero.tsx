
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Sparkles, CheckCircle2, History, ListTodo, Send, Folder } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { FloatingIcons } from './FloatingIcons';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';

const StatCard = ({ title, value, subtext, className }: { title: string, value: string | number, subtext: string, className?: string }) => (
  <Card className={`w-full h-full text-white/90 p-3 flex flex-col justify-between ${className}`}>
    <div className="flex justify-between items-start">
      <p className="text-xs font-medium">{title}</p>
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] leading-tight text-white/80">{subtext}</p>
    </div>
  </Card>
);


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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.15)_0%,transparent_70%)] blur-3xl" />
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
          <Button asChild size="lg">
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
             <div className="h-full flex flex-col bg-card border rounded-lg relative overflow-hidden text-left">
                {/* Dashboard Prototype */}
                <div className="absolute top-4 left-4 z-20 w-1/3 pr-4">
                    <Card className="h-full flex flex-col">
                        <CardContent className="p-3 text-center">
                            <ListTodo className="w-5 h-5 text-muted-foreground mx-auto mb-1"/>
                            <p className="text-xs font-semibold">Today's Goal</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="absolute top-4 right-4 z-20">
                    <Button variant="ghost" size="icon" className="pointer-events-none">
                        <History className="h-5 w-5" />
                    </Button>
                </div>
                <div 
                    className="absolute inset-0 bg-grid-pattern opacity-10"
                    style={{ backgroundSize: '2rem 2rem' }}
                />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
                    <div className="relative w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-primary rounded-full blur-2xl animate-pulse" />
                        <Image src="/chatbot.jpg" alt="AI Orb" width={96} height={96} className="relative rounded-full" />
                    </div>
                    <h1 className="text-3xl font-bold font-headline text-foreground">
                        Hello, Scholar!
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                        Ready to dive into a new topic? Let me know what you'd like to learn about.
                    </p>
                </div>
                <div className="p-4 relative z-10 space-y-4">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 h-28">
                        <StatCard title="Total Topics" value={0} subtext="sessions created" className="bg-yellow-500/80 border border-yellow-400/50" />
                        <StatCard title="Flashcards Made" value={0} subtext="terms to master" className="bg-purple-500/80 border border-purple-400/50" />
                        <StatCard title="Quiz Performance" value="0/0" subtext="correctly answered" className="bg-red-500/80 border border-red-400/50" />
                    </div>
                    <form onSubmit={handleGenerate}>
                        <div className="relative">
                            <div className="flex items-center gap-2 rounded-full p-2 pr-[60px] border bg-secondary">
                                <Input 
                                    placeholder="What do you want to master today?" 
                                    className="h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onClick={(e) => { e.preventDefault(); router.push('/signup'); }}
                                    readOnly
                                />
                                <Button size="icon" variant="ghost" className="rounded-full w-9 h-9 pointer-events-none">
                                    <Folder className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-primary">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
