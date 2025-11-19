
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { BookCopy, Brain, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserDoc } from '@/app/dashboard/exam/actions';
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
    
    const StatCard = ({ title, value, subtext, className }: { title: string, value: string | number, subtext: string, className?: string }) => (
      <Card className={cn("w-full h-full text-white/90 p-3 flex flex-col justify-between", className)}>
        <div className="flex justify-between items-start">
          <p className="text-xs font-medium">{title}</p>
        </div>
        <div className="text-left">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-[11px] leading-tight text-white/80">{subtext}</p>
        </div>
      </Card>
    );

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 h-28">
            <StatCard 
                title="Total Topics"
                value={topics.length}
                subtext="sessions created"
                className="bg-yellow-500/80 border border-yellow-400/50"
            />
            <StatCard 
                title="Flashcards Made"
                value={totalFlashcards}
                subtext="terms to master"
                className="bg-purple-500/80 border border-purple-400/50"
            />
            <StatCard 
                title="Quiz Performance"
                value={totalAttempted > 0 ? `${totalCorrect}/${totalAttempted}` : '0/0'}
                subtext="correctly answered"
                className="bg-red-500/80 border border-red-400/50"
            />
        </div>
    )
}
