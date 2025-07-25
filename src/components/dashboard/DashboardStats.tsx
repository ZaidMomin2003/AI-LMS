
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
        <Card className={cn("shadow-lg", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className={cn("h-4 w-4", iconClassName)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs opacity-80">{subtext}</p>
            </CardContent>
        </Card>
    )

    return (
        <div className="grid grid-cols-3 gap-4">
            <StatCard 
                title="Total Topics"
                value={topics.length}
                subtext="sessions created"
                icon={BookCopy}
                className="bg-yellow-500/20 border-yellow-500/40 text-yellow-900 dark:text-yellow-200 shadow-yellow-500/10"
                iconClassName="text-yellow-900/70 dark:text-yellow-400"
            />
            <StatCard 
                title="Flashcards Made"
                value={totalFlashcards}
                subtext="terms to master"
                icon={Brain}
                className="bg-blue-500/20 border-blue-500/40 text-blue-900 dark:text-blue-200 shadow-blue-500/10"
                iconClassName="text-blue-900/70 dark:text-blue-400"
            />
            <StatCard 
                title="Quiz Performance"
                value={totalAttempted > 0 ? `${totalCorrect}/${totalAttempted}` : '0/0'}
                subtext="correctly answered"
                icon={MessageCircleQuestion}
                className="bg-green-500/20 border-green-500/40 text-green-900 dark:text-green-200 shadow-green-500/10"
                iconClassName="text-green-900/70 dark:text-green-400"
            />
        </div>
    )
}
