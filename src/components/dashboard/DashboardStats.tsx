
'use client';

import { Card, CardContent } from '@/components/ui/card';
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
    
    const StatCard = ({ title, value, icon: Icon, className, iconClassName }: { title: string, value: string | number, icon: React.ElementType, className?: string, iconClassName?: string }) => (
        <Card className={cn(className)}>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
                <div className={cn("p-2 rounded-lg", iconClassName)}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                    <p className="text-xl sm:text-2xl font-bold">{value}</p>
                    <p className="text-xs sm:text-sm font-medium opacity-80">{title}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <StatCard 
                title="Total Topics"
                value={topics.length}
                icon={BookCopy}
                className="bg-yellow-500/20 border-yellow-500/40 text-yellow-900 dark:text-yellow-200 shadow-yellow-500/10"
                iconClassName="text-yellow-900/70 dark:text-yellow-400"
            />
            <StatCard 
                title="Flashcards"
                value={totalFlashcards}
                icon={Brain}
                className="bg-sky-500/20 border-sky-500/40 text-sky-900 dark:text-sky-200 shadow-sky-500/10"
                iconClassName="text-sky-900/70 dark:text-sky-400"
            />
            <StatCard 
                title="Quiz Score"
                value={totalAttempted > 0 ? `${totalCorrect}/${totalAttempted}` : '0/0'}
                icon={MessageCircleQuestion}
                className="bg-emerald-500/20 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 shadow-emerald-500/10"
                iconClassName="text-emerald-900/70 dark:text-emerald-400"
            />
        </div>
    )
}
