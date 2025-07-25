
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
    
    const StatCard = ({ title, value, subtext, icon: Icon, className }: { title: string, value: string | number, subtext: string, icon: React.ElementType, className?: string }) => (
      <Card className={cn("w-full h-full text-white/90 p-4 flex flex-col justify-between", className)}>
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">{title}</p>
          <Icon className="h-4 w-4 text-white/70" />
        </div>
        <div className="text-left">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-white/80">{subtext}</p>
        </div>
      </Card>
    );

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 h-32">
            <StatCard 
                title="Total Topics"
                value={topics.length}
                subtext="sessions created"
                icon={BookCopy}
                className="bg-[#3A3102] border border-yellow-400/50"
            />
            <StatCard 
                title="Flashcards Made"
                value={totalFlashcards}
                subtext="terms to master"
                icon={Brain}
                className="bg-[#210B3B] border border-purple-400/50"
            />
            <StatCard 
                title="Quiz Performance"
                value={totalAttempted > 0 ? `${totalCorrect}/${totalAttempted}` : '0/0'}
                subtext="correctly answered"
                icon={MessageCircleQuestion}
                className="bg-[#3D1111] border border-red-400/50"
            />
        </div>
    )
}
