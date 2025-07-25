
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
    
    const StatCard = ({ title, value, subtext, icon: Icon, className }: { title: string, value: string | number, subtext: string, icon: React.ElementType, className?: string }) => (
        <Card className={cn("transition-all duration-300 hover:-translate-y-1 overflow-hidden", className)}>
            <div className="p-3 md:p-4">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-xs md:text-sm font-medium tracking-tight">{title}</h3>
                  <Icon className="h-4 w-4 text-current" />
                </div>
                <div>
                  <div className="text-lg md:text-2xl font-bold">{value}</div>
                  <p className="text-[10px] md:text-xs opacity-80">{subtext}</p>
                </div>
            </div>
        </Card>
    )

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4">
            <StatCard 
                title="Total Topics"
                value={topics.length}
                subtext="sessions created"
                icon={BookCopy}
                className="bg-blue-500 border-blue-600 text-blue-50 shadow-lg shadow-blue-500/20"
            />
            <StatCard 
                title="Flashcards Made"
                value={totalFlashcards}
                subtext="terms to master"
                icon={Brain}
                className="bg-purple-500 border-purple-600 text-purple-50 shadow-lg shadow-purple-500/20"
            />
            <StatCard 
                title="Quiz Performance"
                value={totalAttempted > 0 ? `${totalCorrect}/${totalAttempted}` : '0/0'}
                subtext="correctly answered"
                icon={MessageCircleQuestion}
                className="bg-green-500 border-green-600 text-green-50 shadow-lg shadow-green-500/20"
            />
        </div>
    )
}
