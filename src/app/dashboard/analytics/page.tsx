'use client';

import { useMemo } from 'react';
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
import { BookCopy, Brain, MessageCircleQuestion } from 'lucide-react';

export default function AnalyticsPage() {
  const { topics } = useTopic();

  const analyticsData = useMemo(() => {
    if (!topics)
      return {
        dailyTopics: [],
        totalTopics: 0,
        totalFlashcards: 0,
        totalQuizQuestions: 0,
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
    };
  }, [topics]);

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
        <div className="grid gap-4 md:grid-cols-3">
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
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Daily Study Activity (Last 7 Days)</CardTitle>
            <CardDescription>Number of new topics created each day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={analyticsData.dailyTopics} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="topics" fill="var(--color-topics)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
