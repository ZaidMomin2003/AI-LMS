'use client';

import { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { format, subDays, isAfter } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BookCopy, Brain, MessageCircleQuestion, Star } from 'lucide-react';
import type { KanbanTask } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const KANBAN_TASKS_STORAGE_KEY = 'scholarai_kanban_tasks';

export default function AnalyticsPage() {
  const { topics } = useTopic();
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(KANBAN_TASKS_STORAGE_KEY);
      if (storedTasks) {
        setKanbanTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
        console.error("Failed to load kanban tasks from localStorage", error);
    }
  }, []);


  const analyticsData = useMemo(() => {
    if (!topics)
      return {
        dailyTopics: [],
        totalTopics: 0,
        totalFlashcards: 0,
        totalQuizQuestions: 0,
        totalPoints: 0,
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

    const totalPoints = kanbanTasks
        .filter(task => task.columnId === 'done')
        .reduce((acc, task) => acc + task.points, 0);

    const dailyTopicsMap = new Map<string, number>();
    const today = new Date();

    // Initialize map for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'MMM d');
      dailyTopicsMap.set(formattedDate, 0);
    }

    topics.forEach((topic) => {
      const topicDate = new Date(topic.createdAt);
      // Check if the topic was created within the last 7 days
      if (isAfter(topicDate, subDays(today, 7))) {
        const formattedDate = format(topicDate, 'MMM d');
        if (dailyTopicsMap.has(formattedDate)) {
          dailyTopicsMap.set(
            formattedDate,
            dailyTopicsMap.get(formattedDate)! + 1
          );
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
    };
  }, [topics, kanbanTasks]);

  const chartConfig = {
    topics: {
      label: 'Topics',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold tracking-tight">
            Performance Analytics
            </h2>
            <p className="text-muted-foreground">
                Track your content creation and study habits over time.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
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
            <CardDescription>Number of new topics created each day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[600px]">
                <BarChart data={analyticsData.dailyTopics} margin={{ left: -20, bottom: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    angle={-45}
                    textAnchor='end'
                    interval={0}
                    height={60}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="topics" fill="var(--color-topics)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
