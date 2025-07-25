
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { BookCopy, Brain, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserDoc } from '@/services/firestore';
import { cn } from '@/lib/utils';

interface QuizStats {
    [topicId: string]: {
        score: number;
        totalQuestions: number;
        timestamp: string;
    };
}

export function DashboardStats() {
    const { user } = useAuth();
    const { topics } = useTopic();
    const [quizStats, setQuizStats] = useState<QuizStats>({});

    useEffect(() => {
        const fetchStats = async () => {
            if (user) {
                const userData = await getUserDoc(user.uid);
                setQuizStats(userData?.quizStats || {});
            } else {
                setQuizStats({});
            }
        };
        fetchStats();
    }, [user]);

    const totalFlashcards = topics.reduce((acc, t) => acc + (t.flashcards?.length || 0), 0);
    
    const { totalCorrect, totalAttempted } = useMemo(() => {
        return Object.values(quizStats).reduce(
            (acc, stat) => {
                acc.totalCorrect += stat.score;
                acc.totalAttempted += stat.totalQuestions;
                return acc;
            },
            { totalCorrect: 0, totalAttempted: 0 }
        );
    }, [quizStats]);
    
    const StatCard = ({ title, value, subtext, icon: Icon, className, iconClassName }: { title: string, value: string | number, subtext: string, icon: React.ElementType, className?: string, iconClassName?: string }) => (
        <Card className={cn("transition-all duration-300 hover:-translate-y-1", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">{title}</CardTitle>
              <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold">{value}</div>
              <p className="text-[10px] md:text-xs">{subtext}</p>
            </CardContent>
        </Card>
    )

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4">
            <StatCard 
                title="Total Topics"
                value={topics.length}
                subtext="sessions created"
                icon={BookCopy}
                className="bg-yellow-500/20 border-yellow-500/40 text-yellow-900 dark:text-yellow-200 shadow-lg shadow-yellow-500/10"
                iconClassName="text-yellow-900/70 dark:text-yellow-400"
            />
            <StatCard 
                title="Flashcards Made"
                value={totalFlashcards}
                subtext="terms to master"
                icon={Brain}
                className="bg-purple-500/20 border-purple-500/40 text-purple-900 dark:text-purple-200 shadow-lg shadow-purple-500/10"
                iconClassName="text-purple-900/70 dark:text-purple-400"
            />
            <StatCard 
                title="Quiz Performance"
                value={totalAttempted > 0 ? `${totalCorrect}/${totalAttempted}` : '0/0'}
                subtext="correctly answered"
                icon={MessageCircleQuestion}
                className="bg-red-500/20 border-red-500/40 text-red-900 dark:text-red-200 shadow-lg shadow-red-500/10"
                iconClassName="text-red-900/70 dark:text-red-400"
            />
        </div>
    )
}
