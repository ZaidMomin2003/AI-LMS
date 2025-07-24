'use client';
import { AppLayout } from '@/components/AppLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentTopics } from '@/components/dashboard/RecentTopics';
import { TopicForm } from '@/components/dashboard/TopicForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Lock, Star } from 'lucide-react';
import { TodayStudyTask } from '@/components/dashboard/TodayStudyTask';
import { useTopic } from '@/context/TopicContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { topics } = useTopic();
  const { subscription } = useSubscription();
  
  const isTopicCreationLocked = subscription?.planName === 'Hobby' && topics.length >= 1;

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Scholar'}!
          </h2>
        </div>
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {isTopicCreationLocked ? (
              <Card className="text-center bg-secondary h-full flex flex-col justify-center">
                 <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="font-headline pt-2">Free Topic Limit Reached</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">You've generated your free topic. To create unlimited study materials, please upgrade your plan.</p>
                 </CardContent>
                 <div className="p-6 pt-0">
                     <Button asChild>
                        <Link href="/pricing">
                            <Star className="mr-2 h-4 w-4" />
                            Upgrade Plan
                        </Link>
                    </Button>
                 </div>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-accent" />
                    Create a New Study Topic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TopicForm />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="col-span-4 md:col-span-3">
             <TodayStudyTask />
          </div>
        </div>
        <RecentTopics />
      </div>
    </AppLayout>
  );
}
