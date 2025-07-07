'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { BookCopy, Brain, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserDoc, updateUserDoc } from '@/services/firestore';

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

    return (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
              <BookCopy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topics.length}</div>
              <p className="text-xs text-muted-foreground">study sessions created</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flashcards Made</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFlashcards}</div>
              <p className="text-xs text-muted-foreground">terms to master</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
               <MessageCircleQuestion className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalAttempted > 0 ? `${totalCorrect} / ${totalAttempted}` : '0 / 0'}
              </div>
              <p className="text-xs text-muted-foreground">questions answered correctly</p>
            </CardContent>
          </Card>
        </div>
    )
}
