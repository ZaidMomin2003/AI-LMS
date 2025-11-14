
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
import { useSubscription } from '@/context/SubscriptionContext';
import { usePomodoro } from '@/context/PomodoroContext';
import { Lock, Star, Play, Pause, RotateCcw, Timer as TimerIcon, Expand, Minimize } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const REST_MINUTES = 5;

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Please enter a task topic.' }),
  sessions: z.coerce.number().min(1, 'At least 1 session is required.').max(8, 'Maximum of 8 sessions.'),
  duration: z.coerce.number().min(10, 'Duration must be at least 10 minutes.').max(60, 'Duration cannot exceed 60 minutes.'),
});

type FormValues = z.infer<typeof formSchema>;
type TimerMode = 'Work' | 'Rest';

const CircularProgress = ({ progress, size = 280 }: { progress: number; size?: number }) => {
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        className="text-muted/20"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      <circle
        className="text-primary transition-all duration-500"
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
  );
};


export default function PomodoroPage() {
  const { subscription } = useSubscription();
  const { pomodoroHistory, addCompletedPomodoro } = usePomodoro();
  const { toast } = useToast();

  const [timerConfig, setTimerConfig] = useState<{ topic: string; totalSessions: number; duration: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('Work');
  const [currentSession, setCurrentSession] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);


  const totalTime = (mode === 'Work' ? (timerConfig?.duration ?? 25) : REST_MINUTES) * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

   // --- Fullscreen Logic ---
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

      if (!timerConfig) return; // Guard clause to prevent crash
      
      if (mode === 'Work') {
        if (currentSession < timerConfig.totalSessions) {
          setMode('Rest');
          setTimeLeft(REST_MINUTES * 60);
          toast({ title: 'Time for a break! ☕️', description: 'Rest for 5 minutes.' });
        } else {
          toast({ title: 'Congratulations! 🎉', description: 'You have completed all your sessions.' });
          addCompletedPomodoro({ 
            topic: timerConfig.topic,
            sessions: timerConfig.totalSessions
          });
          setTimerConfig(null);
        }
      } else { // mode === 'Rest'
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
    setTimerConfig({ topic: data.topic, totalSessions: data.sessions, duration: data.duration });
    setTimeLeft(data.duration * 60);
    setMode('Work');
    setCurrentSession(1);
    setIsActive(true);
  };

  const isLocked = subscription?.planName === 'Hobby' && pomodoroHistory.length > 0;

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerConfig(null);
    form.reset();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const renderTimerContent = () => (
      <>
        <h2 className="text-xl md:text-2xl font-semibold mt-6">{timerConfig!.topic}</h2>
        <p className="text-muted-foreground">Session {currentSession} of {timerConfig!.totalSessions}</p>
        
        <div className="flex items-center gap-4 mt-8">
          <Button onClick={() => setIsActive(!isActive)} size="lg" className="w-32">
            {isActive ? <><Pause className="mr-2" />Pause</> : <><Play className="mr-2" />Resume</>}
          </Button>
          <Button onClick={resetTimer} size="lg" variant="outline" className="w-32">
            <RotateCcw className="mr-2"/>End
          </Button>
           <Button onClick={enterFullscreen} size="lg" variant="outline" className="w-32">
            <Expand className="mr-2"/>Fullscreen
          </Button>
        </div>
      </>
  );

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {!timerConfig ? (
          <>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Pomodoro Timer</h2>
              <p className="text-muted-foreground">Focus your work sessions and take scheduled breaks.</p>
            </div>
            {isLocked ? (
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Lock className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-headline pt-2">Pomodoro Limit Reached</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">You've used your one free Pomodoro session.</p>
                  <p className="text-muted-foreground">Upgrade to a premium plan for unlimited focus time!</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild>
                    <Link href="/pricing"><Star className="mr-2 h-4 w-4" />Upgrade Your Plan</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>New Session</CardTitle>
                  <CardDescription>What do you want to focus on?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Task / Topic</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Chapter 5 Reading" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Session Duration (minutes)</FormLabel>
                                <FormControl>
                                <Input type="number" min="10" max="60" {...field} />
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
                                <FormLabel>Number of Sessions</FormLabel>
                                <FormControl>
                                <Input type="number" min="1" max="8" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>
                       <FormDescription>One session is one block of focused work followed by a 5-minute break.</FormDescription>
                      <Button type="submit"><TimerIcon className="mr-2 h-4 w-4" />Start Focusing</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div ref={timerContainerRef} className="flex flex-col items-center justify-center text-center p-4 bg-background">
              {isFullscreen ? (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                      <p className="text-9xl xl:text-[200px] font-bold font-mono text-foreground">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                      </p>
                      <p className={cn("text-2xl font-semibold tracking-widest uppercase", mode === 'Work' ? 'text-primary' : 'text-green-400')}>{mode}</p>
                      <h2 className="text-3xl font-semibold mt-8">{timerConfig.topic}</h2>
                      <p className="text-lg text-muted-foreground">Session {currentSession} of {timerConfig.totalSessions}</p>
                      <Button onClick={exitFullscreen} size="lg" variant="outline" className="mt-12">
                          <Minimize className="mr-2"/>Exit Fullscreen
                      </Button>
                  </div>
              ) : (
                <>
                  <div className="relative flex items-center justify-center">
                      <CircularProgress progress={progress} />
                      <div className="absolute flex flex-col items-center justify-center">
                          <p className="text-7xl md:text-8xl font-bold font-mono text-foreground">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                          </p>
                          <p className={cn("text-lg font-semibold tracking-widest uppercase", mode === 'Work' ? 'text-primary' : 'text-green-400')}>{mode}</p>
                      </div>
                  </div>
                  {renderTimerContent()}
                </>
              )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

    