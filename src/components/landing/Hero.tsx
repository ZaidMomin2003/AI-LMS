
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Sparkles, CheckCircle2, History, ListTodo, Send, Folder, LayoutDashboard, Bookmark, ClipboardCheck, Map, Timer, Camera, BarChart, Gem, LogOut, Check, PlusCircle, ChevronDown, User, PanelLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { FloatingIcons } from './FloatingIcons';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';


const StatCard = ({ title, value, subtext, className }: { title: string, value: string | number, subtext: string, className?: string }) => (
  <Card className={cn("w-full h-full text-white/90 p-3 flex flex-col justify-between", className)}>
    <div className="flex justify-between items-start">
      <p className="text-xs font-medium">{title}</p>
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] leading-tight text-white/80">{subtext}</p>
    </div>
  </Card>
);

const ProtoSidebarMenuItem = ({ icon: Icon, text, active = false, badgeText }: { icon: React.ElementType, text: string, active?: boolean, badgeText?: string }) => (
    <div className={cn(
        "flex items-center gap-3 text-sm p-2 rounded-md",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80"
    )}>
        <Icon className="w-5 h-5" />
        <span>{text}</span>
        {badgeText && <Badge variant="secondary" className="text-xs ml-auto">{badgeText}</Badge>}
    </div>
);

const TimeCardProto = ({ value, unit }: { value: string, unit: string }) => (
    <div className="flex flex-col items-center">
        <div className="text-2xl font-bold font-mono text-sidebar-primary-foreground bg-sidebar-primary rounded-md w-12 py-1">
            {value}
        </div>
        <div className="text-xs uppercase tracking-wider mt-1 text-sidebar-foreground/70">{unit}</div>
    </div>
)


export function Hero() {
  const router = useRouter();

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
              <Sparkles className="mr-2 h-4 w-4 text-primary" /> Announcing Wisdomis Fun 2.0 &ndash; Start Learning Smarter
            </span>
          </Link>
        </div>
        <h1 className="text-5xl font-headline font-bold tracking-tight text-foreground sm:text-7xl animate-in fade-in slide-in-from-top-12 duration-1000">
          From Topic to <span className="text-primary">Mastery</span>, <span className="text-primary">Instantly</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-top-16 duration-1000 delay-200">
          Stop drowning in textbooks. Wisdomis Fun transforms any subject into clear study notes, interactive flashcards, and challenging quizzes, all in one click. Your smarter, faster learning journey starts here.
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
          
           <Card className="max-w-6xl mx-auto p-1.5 rounded-xl bg-card/60 backdrop-blur-sm shadow-2xl shadow-primary/20 border-2 border-primary/20">
            <div className="flex h-auto md:h-[80vh] md:min-h-[600px] w-full rounded-lg bg-sidebar-DEFAULT overflow-hidden">
                {/* Proto Sidebar (Desktop) */}
                <div className="w-64 p-2 flex-shrink-0 flex-col bg-sidebar-DEFAULT border-r border-sidebar-border hidden md:flex">
                    <div className="flex items-center gap-3 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m14 12-2-1-2 1"/><path d="M12 11V7"/></svg>
                        <span className="font-headline text-2xl font-bold">Wisdomis Fun</span>
                    </div>
                    <div className="p-2 space-y-2 mt-4 flex-1">
                        <ProtoSidebarMenuItem icon={LayoutDashboard} text="Dashboard" active />
                        <ProtoSidebarMenuItem icon={Folder} text="Subjects" />
                        <ProtoSidebarMenuItem icon={Bookmark} text="Bookmarks" />
                        <ProtoSidebarMenuItem icon={ClipboardCheck} text="Study Plan" />
                        <ProtoSidebarMenuItem icon={Map} text="Roadmap" />
                        <ProtoSidebarMenuItem icon={Timer} text="Pomodoro" />
                        <ProtoSidebarMenuItem icon={Camera} text="Capture" badgeText="Beta" />
                        <ProtoSidebarMenuItem icon={BarChart} text="Analytics" />
                        <ProtoSidebarMenuItem icon={Sparkles} text="SageMaker" />
                    </div>
                    <div className="p-2 space-y-2">
                        <div className="p-2 space-y-2 rounded-lg bg-sidebar-accent relative">
                             <p className="text-sm font-semibold text-sidebar-accent-foreground truncate px-1">Final year exam</p>
                             <div className="flex justify-around text-center">
                                <TimeCardProto value="04" unit="Days" />
                                <TimeCardProto value="03" unit="Hrs" />
                                <TimeCardProto value="11" unit="Mins" />
                                <TimeCardProto value="51" unit="Secs" />
                            </div>
                        </div>
                        <div className="cursor-pointer border-0 bg-primary text-primary-foreground font-semibold flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-10">
                            <Gem />
                            <span>Scholar Subscription</span>
                        </div>
                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-sidebar-accent">A</AvatarFallback>
                                </Avatar>
                                <span className="truncate text-sm">arshadbashamomin</span>
                            </div>
                            <LogOut className="w-4 h-4 text-sidebar-foreground/70" />
                        </div>
                    </div>
                </div>

                {/* Main Content (Shared) */}
                <div className="h-full flex-1 flex flex-col bg-card border rounded-lg relative overflow-hidden text-left">
                    {/* Proto Mobile Header */}
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 min-w-0 md:hidden">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m14 12-2-1-2 1"/><path d="M12 11V7"/></svg>
                            <span className="font-headline text-lg font-bold">Wisdomis Fun</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="pointer-events-none">
                                <Bookmark className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="pointer-events-none">
                                <PanelLeft className="h-5 w-5" />
                            </Button>
                        </div>
                    </header>
                    {/* Desktop-only elements */}
                    <div className="absolute top-4 right-4 z-20 hidden md:block">
                        <Button variant="ghost" size="icon" className="pointer-events-none">
                            <History className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="absolute top-4 left-4 z-20 w-1/3 max-w-xs pr-4 hidden md:block">
                        <Card className="h-full flex flex-col bg-secondary/50">
                            <CardContent className="p-3">
                                <p className="font-headline text-sm mb-2">Today's Study Goal</p>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Thermodynamics: First law, internal energy, heat and work...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div 
                        className="absolute inset-0 bg-grid-pattern opacity-10"
                        style={{ backgroundSize: '2rem 2rem' }}
                    />
                    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center relative z-10">
                        <div className="relative w-24 h-24 mb-4">
                            <div className="absolute inset-0 bg-primary rounded-full blur-2xl" />
                            <Image src="/chatbot.jpg" alt="AI Orb" width={96} height={96} className="relative rounded-full" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">
                            Hello, Scholar!
                        </h1>
                        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                            Ready to dive into a new topic? Let me know what you'd like to learn about.
                        </p>
                    </div>
                    <div className="p-4 relative z-10 space-y-4">
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:h-28">
                            <StatCard title="Total Topics" value={13} subtext="sessions created" className="bg-yellow-500/80 border border-yellow-400/50" />
                            <StatCard title="Flashcards Made" value={118} subtext="terms to master" className="bg-purple-500/80 border border-purple-400/50" />
                            <StatCard title="Quiz Performance" value="13/25" subtext="correctly answered" className="bg-red-500/80 border border-red-400/50" />
                        </div>
                        <div className="relative">
                            <div className="flex items-center gap-2 rounded-full p-2 pr-[60px] border bg-secondary">
                                <Input 
                                    placeholder="What do you want to master?" 
                                    className="h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-none"
                                />
                                <div className="flex items-center gap-2 p-2 rounded-full bg-background/50 border">
                                    <p className="text-sm">Physics</p>
                                </div>
                            </div>
                            <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-primary pointer-events-none">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
