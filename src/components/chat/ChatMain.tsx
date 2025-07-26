
'use client';

import { Send, Bot, History, BookOpen, ListTodo, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { DashboardStats } from '../dashboard/DashboardStats';
import { TopicForm } from '../dashboard/TopicForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useTopic } from '@/context/TopicContext';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { TodayStudyTask } from '../dashboard/TodayStudyTask';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '../ui/badge';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent } from '../ui/card';


export function ChatMain() {
  const { user } = useAuth();
  const { topics } = useTopic();
  const { subscription } = useSubscription();
  const isMobile = useIsMobile();
  
  const isTopicGenerationLocked = subscription?.planName === 'Hobby' && topics.length > 0;
  
  return (
    <div className="h-full flex flex-col bg-card border rounded-lg relative overflow-hidden">
        {/* Top-left: Today's Task */}
        <div className="absolute top-4 left-4 z-20 w-1/3 pr-4">
             <TodayStudyTask />
        </div>

        {/* Top-right: History Button and Dialog */}
        <div className="absolute top-4 right-4 z-20">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <History className="h-5 w-5" />
                        <span className="sr-only">View History</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Recent Topics</DialogTitle>
                        <DialogDescription>
                            Here are the study topics you've recently generated.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] pr-4">
                         {topics.length > 0 ? (
                            <div className="space-y-4">
                                {topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium leading-none">{topic.title}</p>
                                            <Badge variant="secondary">{topic.subject}</Badge>
                                        </div>
                                    <p className="text-sm text-muted-foreground">
                                        Created {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                                    </p>
                                    </div>
                                    <Button asChild variant="ghost" size="sm">
                                    <Link href={`/topic/${topic.id}`}>Study</Link>
                                    </Button>
                                </div>
                                ))}
                            </div>
                         ) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No topics created yet.</p>
                            </div>
                         )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>

       <div 
         className="absolute inset-0 bg-grid-pattern opacity-10"
         style={{ backgroundSize: '2rem 2rem' }}
       />
       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-primary rounded-full blur-2xl animate-pulse" />
                <Image src="/chatbot.jpg" alt="AI Orb" width={128} height={128} className="relative rounded-full" />
            </div>

            <h1 className="text-4xl font-bold font-headline text-foreground">
                Hello, {user?.displayName?.split(' ')[0] || 'Scholar'}!
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Ready to dive into a new topic? Let me know what you'd like to learn about.
            </p>
        </div>

        <div className="p-4 relative z-10 space-y-4">
             <DashboardStats />
             {isTopicGenerationLocked ? (
                <Card className="text-center p-4 bg-secondary">
                  <CardContent className="p-2 space-y-3">
                    <div className="mx-auto bg-primary/10 text-primary p-2 rounded-full w-fit">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-headline">Free Topic Limit Reached</h3>
                      <p className="text-sm text-muted-foreground">
                        Create unlimited notes with a Pro plan. Upgrade now to continue your learning journey.
                      </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/pricing">
                            <Star className="mr-2 h-4 w-4" />
                            Upgrade Now
                        </Link>
                    </Button>
                  </CardContent>
                </Card>
             ) : (
                <TopicForm variant="chat" />
             )}
        </div>
    </div>
  );
}
