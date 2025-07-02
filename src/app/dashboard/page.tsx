'use client';
import { AppLayout } from '@/components/AppLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentTopics } from '@/components/dashboard/RecentTopics';
import { TopicForm } from '@/components/dashboard/TopicForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  
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
          <Card className="col-span-4">
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
          <RecentTopics />
        </div>
      </div>
    </AppLayout>
  );
}
