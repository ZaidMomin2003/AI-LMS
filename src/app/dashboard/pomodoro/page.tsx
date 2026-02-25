
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePomodoro } from '@/context/PomodoroContext';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Expand, Minimize, Lock, Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/context/SubscriptionContext';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const REST_MINUTES = 5;

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Please enter a task topic.' }),
  sessions: z.coerce.number().min(1, 'At least 1 session is required.').max(8, 'Maximum of 8 sessions.'),
  duration: z.coerce.number().min(10, 'Duration must be at least 10 minutes.').max(60, 'Duration cannot exceed 60 minutes.'),
});

type FormValues = z.infer<typeof formSchema>;
type TimerMode = 'Work' | 'Rest';

const CircularProgress = ({ progress, size = 320, mode }: { progress: number; size?: number; mode: TimerMode }) => {
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative group">
      <div className={cn("absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-1000", mode === 'Work' ? 'bg-primary' : 'bg-green-500')} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 drop-shadow-2xl">
        <circle
          className="text-muted/10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className={cn("transition-all duration-1000", mode === 'Work' ? 'text-primary' : 'text-green-500')}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
    </div>
  );
};


export default function PomodoroPage() {
  const { addCompletedPomodoro } = usePomodoro();
  const { canUseFeature } = useSubscription();
  const { toast } = useToast();

  const [timerConfig, setTimerConfig] = useState<{ topic: string; totalSessions: number; duration: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('Work');
  const [currentSession, setCurrentSession] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  const canUsePomodoro = canUseFeature('pomodoro');


  const totalTime = (mode === 'Work' ? (timerConfig?.duration ?? 25) : REST_MINUTES) * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const enterFullscreen = () => {
    if (timerContainerRef.current) {
      timerContainerRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);

      if (!timerConfig) return;

      if (mode === 'Work') {
        addCompletedPomodoro({
          topic: timerConfig.topic,
          sessions: 1
        });
        if (currentSession < timerConfig.totalSessions) {
          setMode('Rest');
          setTimeLeft(REST_MINUTES * 60);
          toast({ title: 'Time for a break! ☕️', description: 'Rest for 5 minutes.' });
        } else {
          toast({ title: 'Congratulations! 🎉', description: 'You have completed all your sessions.' });
          setTimerConfig(null);
        }
      } else {
        setMode('Work');
        setTimeLeft(timerConfig.duration * 60);
        setCurrentSession((prev) => prev + 1);
        toast({ title: 'Back to work! 💪', description: 'Starting the next session.' });
      }
    }
  }, [timeLeft, mode, currentSession, timerConfig, toast, addCompletedPomodoro]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '', sessions: 1, duration: 25 },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!canUsePomodoro) {
      toast({
        variant: "destructive",
        title: "Free Limit Reached",
        description: "Please upgrade to Pro to start more Pomodoro sessions.",
      });
      return;
    }
    setTimerConfig({ topic: data.topic, totalSessions: data.sessions, duration: data.duration });
    setTimeLeft(data.duration * 60);
    setMode('Work');
    setCurrentSession(1);
    setIsActive(true);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerConfig(null);
    form.reset();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const renderTimerContent = () => (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mt-8"
      >
        <h2 className="text-3xl font-black font-headline tracking-tighter">{timerConfig!.topic}</h2>
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="border-border/50 text-[10px] uppercase font-bold tracking-widest px-3 py-1">
            Session {currentSession} / {timerConfig!.totalSessions}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
            <span className="text-[10px] font-black text-primary uppercase">{mode} Mode</span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-12 bg-card/20 backdrop-blur-xl p-4 rounded-[2rem] border border-border/40 shadow-xl">
        <Button
          onClick={() => setIsActive(!isActive)}
          size="lg"
          className={cn(
            "h-14 px-8 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 font-bold tracking-tight",
            isActive ? "bg-background/50 text-foreground border border-border/40 hover:bg-background/80" : "bg-primary text-primary-foreground shadow-primary/20"
          )}
        >
          {isActive ? <><Pause className="mr-2 h-5 w-5" />Pause</> : <><Play className="mr-2 h-5 w-5" />Resume</>}
        </Button>
        <Button onClick={resetTimer} size="icon" variant="outline" className="h-14 w-14 rounded-2xl border-border/40 bg-background/50 hover:bg-background/80 hover:text-red-500 transition-all">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button onClick={enterFullscreen} size="icon" variant="outline" className="h-14 w-14 rounded-2xl border-border/40 bg-background/50 hover:bg-background/80 text-primary transition-all">
          <Expand className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const renderForm = () => (
    <Card className="max-w-2xl mx-auto border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <CardHeader className="p-8 pb-4 relative z-10 text-center">
        <div className="mx-auto p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-4">
          <TimerIcon className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-black font-headline tracking-tighter">Deep Work Architect</CardTitle>
        <CardDescription className="text-muted-foreground/60 font-medium tracking-tight">Configure your focus parameters for peak performance.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4 relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3 block ml-1">Current Objective</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="e.g., Master Advanced Calculus" className="h-14 px-6 rounded-2xl border-border/20 bg-background/20 focus:bg-background/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-base placeholder:text-muted-foreground/20" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3 block ml-1">Flow Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min="10" max="60" className="h-14 px-6 rounded-2xl border-border/20 bg-background/20 focus:bg-background/40 transition-all font-bold text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3 block ml-1">Target Sessions</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="8" className="h-14 px-6 rounded-2xl border-border/20 bg-background/20 focus:bg-background/40 transition-all font-bold text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] font-black uppercase tracking-widest text-xs">
                <Play className="mr-2 h-4 w-4" />
                Enter Flow State
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-8 pt-6 relative min-h-screen items-start overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-green-500/5 blur-[120px] -z-10" />

        <div className="relative z-10 space-y-12 max-w-7xl mx-auto">
          {!timerConfig ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4 mb-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                    <TimerIcon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/5 text-primary border-primary/10">Deep Work</Badge>
                </div>
                <h2 className="text-5xl font-headline font-black tracking-tighter leading-none mb-4">
                  Focus <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Chamber</span>
                </h2>
                <p className="text-muted-foreground font-medium text-xl opacity-70 leading-relaxed max-w-xl mx-auto">
                  Eliminate distractions and synchronize your biological clock with your academic objectives.
                </p>
              </div>
              {canUsePomodoro ? renderForm() : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="max-w-md w-full text-center mx-auto border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden p-8">
                    <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-2xl w-fit mb-4">
                      <Lock className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl font-black">Chamber Locked</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium px-4 mt-2">You've reached the free focus limit. Upgrade to unlock unlimited deep work cycles.</CardDescription>
                    <Button asChild size="lg" className="mt-8 rounded-full px-10 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                      <Link href="/dashboard/pricing">
                        <Gem className="mr-2 h-4 w-4" />
                        Ascend to Pro
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              )}
            </div>
          ) : (
            <div ref={timerContainerRef} className={cn("flex flex-col items-center justify-center text-center p-8 bg-transparent transition-all duration-1000", isFullscreen ? "h-screen w-screen fixed inset-0 z-50 bg-background" : "min-h-[60vh]")}>
              {isFullscreen ? (
                <div className="flex flex-col items-center justify-center h-full w-full space-y-12 animate-in fade-in duration-1000">
                  <div className="relative group">
                    <div className={cn("absolute inset-0 rounded-full blur-[100px] opacity-20 animate-pulse transition-colors duration-1000", mode === 'Work' ? 'bg-primary' : 'bg-green-500')} />
                    <p className="text-[120px] md:text-[240px] font-black font-mono text-foreground leading-none tracking-tighter relative z-10 drop-shadow-2xl">
                      {String(minutes).padStart(2, '0')}<span className="opacity-30">:</span>{String(seconds).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Badge className={cn("px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em] border-0 text-white shadow-xl", mode === 'Work' ? 'bg-primary' : 'bg-green-500')}>
                      {mode} PHASE
                    </Badge>
                    <h2 className="text-4xl font-black font-headline tracking-tighter">{timerConfig.topic}</h2>
                    <p className="text-xl text-muted-foreground font-medium opacity-60">Session {currentSession} of {timerConfig.totalSessions}</p>
                  </div>
                  <Button onClick={exitFullscreen} size="lg" variant="outline" className="h-16 px-10 rounded-full border-border/40 bg-background/50 backdrop-blur-md hover:bg-background/80 transition-all hover:scale-105 active:scale-95 font-bold tracking-widest text-xs uppercase">
                    <Minimize className="mr-3 h-5 w-5" />Exit Chamber
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center justify-center"
                >
                  <div className="relative flex items-center justify-center">
                    <CircularProgress progress={progress} mode={mode} />
                    <div className="absolute flex flex-col items-center justify-center">
                      <p className="text-8xl font-black font-mono text-foreground tracking-tighter">
                        {String(minutes).padStart(2, '0')}<span className="opacity-20">:</span>{String(seconds).padStart(2, '0')}
                      </p>
                      <p className={cn("text-xs font-black tracking-[0.4em] uppercase opacity-60", mode === 'Work' ? 'text-primary' : 'text-green-500')}>{mode}</p>
                    </div>
                  </div>
                  {renderTimerContent()}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
