
'use client';

import { useMemo } from 'react';
import { useTopic } from '@/context/TopicContext';
import { useTask } from '@/context/TaskContext';
import { usePomodoro } from '@/context/PomodoroContext';
import { format, subDays, isAfter } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { BookCopy, Brain, MessageCircleQuestion, Star, Timer, ArrowLeft, BookOpenCheck, TrendingUp, CheckCircle2, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { cn } from '@/lib/utils';

function AnalyticsContent() {
  const { topics, dataLoading: topicsLoading } = useTopic();
  const { tasks, loading: tasksLoading } = useTask();
  const { pomodoroHistory, loading: pomodoroLoading } = usePomodoro();
  const isMobile = useIsMobile();

  const analyticsData = useMemo(() => {
    if (!topics || !tasks || !pomodoroHistory)
      return {
        dailyTopics: [],
        totalTopics: 0,
        totalFlashcards: 0,
        totalQuizQuestions: 0,
        totalPoints: 0,
        totalPomodoroSessions: 0,
        pomodoroTopics: [],
      };

    const totalTopics = topics.length;
    const totalFlashcards = topics.reduce(
      (acc, t) => acc + (t.flashcards?.length || 0),
      0
    );
    const totalQuizQuestions = topics.reduce(
      (acc, t) => acc + (t.quiz?.length || 0),
      0
    );

    const totalPoints = tasks
      .filter((task) => task.columnId === 'done')
      .reduce((acc, task) => acc + task.points, 0);

    const totalPomodoroSessions = pomodoroHistory.reduce(
      (acc, p) => acc + p.sessions,
      0
    );

    const pomodoroTopicStats = pomodoroHistory.reduce<Record<string, number>>(
      (acc, session) => {
        acc[session.topic] = (acc[session.topic] || 0) + session.sessions;
        return acc;
      },
      {}
    );
    const pomodoroTopics = Object.entries(pomodoroTopicStats)
      .map(([topic, sessions]) => ({ topic, sessions }))
      .sort((a, b) => b.sessions - a.sessions);

    const dailyTopicsMap = new Map<string, number>();
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'MMM d');
      dailyTopicsMap.set(formattedDate, 0);
    }

    topics.forEach((topic) => {
      if (topic.createdAt) {
        const topicDate = new Date(topic.createdAt);
        if (isAfter(topicDate, subDays(today, 7))) {
          const formattedDate = format(topicDate, 'MMM d');
          if (dailyTopicsMap.has(formattedDate)) {
            dailyTopicsMap.set(
              formattedDate,
              dailyTopicsMap.get(formattedDate)! + 1
            );
          }
        }
      }
    });

    const dailyTopicsChartData = Array.from(dailyTopicsMap.entries()).map(
      ([date, count]) => ({
        date,
        topics: count,
      })
    );

    return {
      dailyTopics: dailyTopicsChartData,
      totalTopics,
      totalFlashcards,
      totalQuizQuestions,
      totalPoints,
      totalPomodoroSessions,
      pomodoroTopics,
    };
  }, [topics, tasks, pomodoroHistory]);

  const chartConfig = {
    topics: {
      label: 'Topics',
      color: 'hsl(var(--primary))',
    },
  };

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: { title: string, value: string | number, subtext: string, icon: any, colorClass: string }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border-border/40 bg-card/40 backdrop-blur-xl">
      <div className={cn("absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20", colorClass)} />
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{title}</p>
          <div className={cn("p-2 rounded-lg bg-background/50 border border-border/50 shadow-sm", colorClass.replace('bg-', 'text-'))}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="text-left">
          <p className="text-3xl font-black tracking-tighter text-foreground">{value}</p>
          <p className="text-[11px] font-medium text-muted-foreground leading-tight mt-1">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (topicsLoading || pomodoroLoading || tasksLoading) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 relative overflow-hidden">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 relative min-h-full">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/5 blur-[120px] -z-10" />

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              Performance <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Analytics</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg opacity-80">
              Visualizing your journey from scholar to master.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sessions"
            value={analyticsData.totalTopics}
            subtext="Topics you have mastered"
            icon={BookCopy}
            colorClass="bg-yellow-500"
          />
          <StatCard
            title="Mastery Terms"
            value={analyticsData.totalFlashcards}
            subtext="Flashcards generated"
            icon={Brain}
            colorClass="bg-purple-500"
          />
          <StatCard
            title="AI Assessment"
            value={analyticsData.totalQuizQuestions}
            subtext="Evaluation questions"
            icon={MessageCircleQuestion}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Impact Points"
            value={analyticsData.totalPoints}
            subtext="Earned from consistency"
            icon={Star}
            colorClass="bg-red-500"
          />
        </div>

        {/* Activity Chart Section */}
        <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black font-headline tracking-tight">Study Frequency</CardTitle>
                <CardDescription className="text-base font-medium opacity-70">Content creation frequency over the last 7 days.</CardDescription>
              </div>
              <div className="hidden sm:flex h-10 px-4 items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="h-4 w-4" />
                Activity Log
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="overflow-x-auto overflow-y-hidden">
              <ChartContainer config={chartConfig} className="h-[350px] w-full min-w-[600px]">
                <BarChart data={analyticsData.dailyTopics} margin={{ top: 20, left: -20, right: 20, bottom: isMobile ? 20 : 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={isMobile ? 15 : 10}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    interval={0}
                    height={isMobile ? 70 : 40}
                    fontSize={13}
                    fontWeight={600}
                    tick={{ fill: 'currentColor', opacity: 0.5 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={13}
                    fontWeight={600}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'currentColor', opacity: 0.5 }}
                  />
                  <Tooltip cursor={{ fill: 'hsl(var(--primary))', opacity: 0.03 }} content={<ChartTooltipContent indicator="line" />} />
                  <Bar
                    dataKey="topics"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pomodoro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden flex flex-col">
            <CardHeader className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shadow-sm border border-orange-500/10">
                  <Timer className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black font-headline">Deep Work</CardTitle>
              </div>
              <CardDescription className="font-medium opacity-70">Focus blocks completed.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0 mt-auto">
              <div className="text-7xl font-black tracking-tighter text-foreground mb-2">{analyticsData.totalPomodoroSessions}</div>
              <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest opacity-60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                25-minute sessions
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
            <CardHeader className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black font-headline">Session Distribution</CardTitle>
                  <CardDescription className="opacity-70 font-medium text-sm">Most focused topics during Pomodoro sessions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {analyticsData.pomodoroTopics.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.pomodoroTopics.slice(0, 4).map((item, idx) => (
                    <div key={item.topic} className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 border border-border/20 group hover:border-primary/30 transition-all duration-300">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{item.topic}</p>
                        <p className="text-xs text-muted-foreground font-medium opacity-70">Focus Priority</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black tracking-tight">{item.sessions}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-50">Blocks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <Timer className="w-12 h-12 mb-3 text-muted-foreground" />
                  <p className="text-sm font-bold tracking-tight">Your deep work log is currently empty.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default function AnalyticsPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Background Patterns for Mobile */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03]" style={{ backgroundSize: '24px 24px' }} />

        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black font-headline text-lg -mb-1 tracking-tight">Wisdom</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">AI Analytics</span>
              </div>
            </Link>
          </div>
        </header>
        <div className="flex-1 min-h-0 overflow-y-auto relative z-10 pt-2 pb-10">
          <AnalyticsContent />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <AnalyticsContent />
    </AppLayout>
  );
}
