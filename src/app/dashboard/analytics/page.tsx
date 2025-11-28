
'use client';

import { useMemo } from 'react';
import { useTopic } from '@/context/TopicContext';
import { useTask } from '@/context/TaskContext';
import { usePomodoro } from '@/context/PomodoroContext';
import { format, subDays, isAfter } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { BookCopy, Brain, MessageCircleQuestion, Star, Timer, ArrowLeft } from 'lucide-react';
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

export default function AnalyticsPage() {
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

  if (topicsLoading || pomodoroLoading || tasksLoading) {
    return (
      <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            Performance Analytics
          </h2>
          <p className="text-muted-foreground">
            Track your content creation and study habits over time.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Topics
              </CardTitle>
              <BookCopy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalTopics}
              </div>
              <p className="text-xs text-muted-foreground">
                study sessions created
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Flashcards
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalFlashcards}
              </div>
              <p className="text-xs text-muted-foreground">terms generated</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quiz Questions
              </CardTitle>
              <MessageCircleQuestion className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalQuizQuestions}
              </div>
              <p className="text-xs text-muted-foreground">
                questions generated
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Points Earned
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalPoints}
              </div>
              <p className="text-xs text-muted-foreground">
                from completed tasks
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Daily Study Activity (Last 7 Days)</CardTitle>
            <CardDescription>
              Number of new topics created each day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full min-w-[600px]"
              >
                <BarChart
                  data={analyticsData.dailyTopics}
                  margin={{ left: -20, bottom: isMobile ? 20 : 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={isMobile ? 10 : 5}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    interval={0}
                    height={isMobile ? 60 : 30}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="topics"
                    fill="var(--color-topics)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Pomodoros
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalPomodoroSessions}
              </div>
              <p className="text-xs text-muted-foreground">
                25-minute focus blocks completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Topics</CardTitle>
              <CardDescription>
                Topics you've focused on during sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.pomodoroTopics.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead className="text-right">Sessions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.pomodoroTopics.slice(0, 5).map((item) => (
                      <TableRow key={item.topic}>
                        <TableCell className="font-medium truncate max-w-xs">
                          {item.topic}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.sessions}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No Pomodoro sessions completed yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="hidden md:flex justify-center pt-8">
          <Button asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
