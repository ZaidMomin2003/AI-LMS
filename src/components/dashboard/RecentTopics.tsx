'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export function RecentTopics() {
  const { topics } = useTopic();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Topics</CardTitle>
        <CardDescription>
          You have created {topics.length} topics. Jump back into a recent one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topics.length > 0 ? (
          <ScrollArea className="h-[250px]">
          <div className="space-y-4">
            {topics.slice(0, 5).map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{topic.title}</p>
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
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No topics created yet.</p>
            <p className="text-sm">Enter a topic to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
