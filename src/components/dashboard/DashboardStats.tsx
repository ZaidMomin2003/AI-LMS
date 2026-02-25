
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

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: { title: string, value: string | number, subtext: string, icon: any, colorClass: string }) => (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border-border/40 bg-card/40 backdrop-blur-xl">
            <div className={cn("absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20", colorClass)} />
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{title}</p>
                    <div className={cn("p-1.5 rounded-lg bg-background/50 border border-border/50", colorClass.replace('bg-', 'text-'))}>
                        <Icon className="w-3.5 h-3.5" />
                    </div>
                </div>
                <div className="text-left mt-auto">
                    <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
                    <p className="text-[10px] font-medium text-muted-foreground leading-tight">{subtext}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 gap-3 h-full">
            <StatCard
                title="Learning Topics"
                value={topics.length}
                subtext="Sessions generated"
                icon={BookCopy}
                colorClass="bg-yellow-500"
            />
            <StatCard
                title="Mastery Cards"
                value={totalFlashcards}
                subtext="Terms to master"
                icon={Brain}
                colorClass="bg-purple-500"
            />
            <StatCard
                title="Quiz Accuracy"
                value={totalAttempted > 0 ? `${Math.round((totalCorrect / totalAttempted) * 100)}%` : '0%'}
                subtext={totalAttempted > 0 ? `${totalCorrect} correct answers` : 'No attempts yet'}
                icon={MessageCircleQuestion}
                colorClass="bg-red-500"
            />
        </div>
    )
}
