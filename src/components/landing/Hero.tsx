
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, History, Sparkles, Send, Folder, LayoutDashboard, Bookmark, ClipboardCheck, Map, Timer, Camera, BarChart, Gem, LogOut, Check, BookOpenCheck, Search, MoreHorizontal, CalendarPlus, LifeBuoy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


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
    </div>
);

const ProtoSidebarGroupLabel = ({ text }: { text: string }) => (
  <div className="px-2 pt-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">{text}</div>
)

const TimeCardProto = ({ value, unit }: { value: string, unit: string }) => (
    <div className="flex flex-col items-center">
        <div className="text-2xl font-bold font-mono text-sidebar-primary-foreground bg-sidebar-primary rounded-md w-12 py-1">
            {value}
        </div>
        <div className="text-xs uppercase tracking-wider mt-1 text-sidebar-foreground/70">{unit}</div>
    </div>
)

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date('2026-01-10T00:00:00') - +new Date();
        
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
             timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return timeLeft as {days: number, hours: number, minutes: number, seconds: number};
    };

    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

    useEffect(() => {
        // Set initial time on mount to avoid hydration mismatch
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    
    if (!timeLeft) return null;

    const timerComponents: {unit: 'days' | 'hours' | 'minutes' | 'seconds', label: string}[] = [
        { unit: 'days', label: 'Days' },
        { unit: 'hours', label: 'Hrs' },
        { unit: 'minutes', label: 'Mins' },
        { unit: 'seconds', label: 'Secs' },
    ];

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {timerComponents.map(part => (
                <div key={part.unit} className="flex flex-col items-center">
                    <div className="text-lg sm:text-xl font-bold font-mono text-background bg-foreground/90 rounded-md w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center">
                        {String(timeLeft[part.unit] || 0).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider mt-1 text-muted-foreground">{part.label}</div>
                </div>
            ))}
        </div>
    );
};


export function Hero() {
  return (
    <div className="bg-background relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="from-primary/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
        <div className="bg-primary/5 absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:16px_16px] opacity-5 dark:opacity-10"></div>


      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <Link href="/#pricing" className="group block">
              <div className="border-border bg-background/80 relative flex flex-col items-center gap-4 rounded-2xl border p-4 text-sm backdrop-blur-sm overflow-hidden">
                 <p className="text-muted-foreground px-2 text-center">
                    <span className="font-semibold text-primary">New Year Offer:</span> One-Time Payment for a Lifetime of Learning!
                </p>
                <CountdownTimer />
              </div>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-foreground/10 via-foreground to-foreground/70 bg-gradient-to-tl bg-clip-text text-center text-4xl font-headline font-bold tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
          >
            From Topic to <span className="from-primary via-primary/80 to-primary/70 bg-gradient-to-br bg-clip-text text-transparent">Mastery</span>, Instantly
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg"
          >
            Ace your exams with the ultimate study toolkit. Generate ultra-detailed notes, interactive flashcards, and challenging quizzes for any topic imaginable. Stop memorizing and start mastering your subjects today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group bg-primary text-primary-foreground hover:shadow-primary/30 relative overflow-hidden rounded-full px-6 shadow-lg transition-all duration-300"
              asChild
            >
              <Link href="/signup">
                <span className="relative z-10 flex items-center">
                  Start Learning for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="from-primary via-primary/90 to-primary/80 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border bg-background/50 flex items-center gap-2 rounded-full backdrop-blur-sm"
              asChild
            >
               <Link href="#features">
                Explore Features
              </Link>
            </Button>
          </motion.div>

          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: 'spring',
              stiffness: 50,
            }}
            className="relative mx-auto mt-16 max-w-6xl"
          >
            <div className="border-border/40 bg-background/50 overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm">
                <div className="border-border/40 bg-muted/50 flex h-10 items-center border-b px-4">
                    <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-background/50 text-muted-foreground mx-auto flex items-center rounded-md px-3 py-1 text-xs">
                    wisdomis.fun/dashboard
                    </div>
              </div>
              <div className="relative">
                <div className="p-1.5 rounded-b-xl bg-card/60">
                    <div className="flex h-auto md:h-[90vh] md:min-h-[750px] w-full rounded-lg bg-sidebar-DEFAULT overflow-hidden">
                        {/* Proto Sidebar (Desktop) */}
                        <div className="w-64 p-2 flex-shrink-0 flex-col bg-sidebar-DEFAULT border-r border-sidebar-border hidden md:flex">
                             <div className="flex items-center gap-3 p-2">
                                <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                                    <BookOpenCheck className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                                    <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                                </div>
                            </div>
                            <div className="relative mt-2 px-2">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search..." className="pl-10 h-9 bg-background/50" />
                            </div>

                            <div className="space-y-1 p-2 mt-2 flex-1">
                                <ProtoSidebarMenuItem icon={LayoutDashboard} text="Dashboard" active />
                                <ProtoSidebarMenuItem icon={BarChart} text="Analytics" />
                                <div className="py-2"><div className="border-t border-sidebar-border mx-2"></div></div>
                                <ProtoSidebarGroupLabel text="Organize" />
                                <ProtoSidebarMenuItem icon={Folder} text="Subjects" />
                                <ProtoSidebarMenuItem icon={Bookmark} text="Bookmarks" />
                                <ProtoSidebarMenuItem icon={ClipboardCheck} text="Study Plan" />
                                <div className="py-2"><div className="border-t border-sidebar-border mx-2"></div></div>
                                <ProtoSidebarGroupLabel text="Tools" />
                                <ProtoSidebarMenuItem icon={Map} text="Roadmap" />
                                <ProtoSidebarMenuItem icon={Timer} text="Pomodoro" />
                                <ProtoSidebarMenuItem icon={Camera} text="Capture" />
                                <ProtoSidebarMenuItem icon={Sparkles} text="WisdomGPT" />
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
                                <div className="cursor-pointer group relative rounded-lg p-3 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground overflow-hidden">
                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                        <Gem className="w-4 h-4" />
                                        Upgrade to Pro
                                    </h4>
                                    <p className="text-xs text-primary-foreground/80">Unlock all features</p>
                                    <div className="absolute top-1 right-1 bg-primary-foreground/20 text-primary-foreground rounded-full p-1.5">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <Sparkles className="absolute -bottom-4 -right-2 w-16 h-16 text-primary-foreground/10" />
                                </div>
                                 <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-sidebar-accent">A</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 truncate">
                                            <p className="text-sm font-medium truncate">arshad</p>
                                            <p className="text-xs text-muted-foreground truncate">arshad@example.com</p>
                                        </div>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-sidebar-foreground/70" />
                                </div>
                            </div>
                        </div>

                        {/* Main Content (Shared) */}
                        <div className="h-full flex-1 flex flex-col bg-card border rounded-lg relative overflow-hidden text-left">
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
                </div>
                <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent opacity-0"></div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}

    