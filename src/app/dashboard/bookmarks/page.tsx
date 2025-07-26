
'use client';

import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { format } from 'date-fns';
import { Bookmark, Search } from 'lucide-react';
import type { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

export default function BookmarksPage() {
  const { topics, dataLoading } = useTopic();
  const [searchTerm, setSearchTerm] = useState('');

  const bookmarkedTopics = useMemo(() => {
    if (!topics) return [];
    return topics.filter(topic => topic.isBookmarked);
  }, [topics]);
  
  const filteredTopics = useMemo(() => {
    if (!bookmarkedTopics) return [];
    return bookmarkedTopics.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookmarkedTopics, searchTerm]);

  const groupedByDate = useMemo(() => {
    return filteredTopics.reduce((acc: Record<string, Topic[]>, topic) => {
      const dateKey = format(new Date(topic.createdAt), 'MMMM d, yyyy');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(topic);
      return acc;
    }, {});
  }, [filteredTopics]);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (dataLoading) {
      return (
          <AppLayout>
              <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96 mb-6" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-48" />
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
              </div>
          </AppLayout>
      )
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            My Bookmarks
          </h2>
          <p className="text-muted-foreground">
            All your saved study topics, organized by date.
          </p>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search bookmarks by title or subject..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        {bookmarkedTopics.length === 0 ? (
           <Card className="text-center mt-6">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Bookmark className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline pt-2">No Bookmarks Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Click the bookmark icon on a topic page to save it here for later.
                </p>
            </CardContent>
          </Card>
        ) : filteredTopics.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
                <p>No bookmarks found for "{searchTerm}".</p>
            </div>
        ) : (
            <div className="space-y-6">
                {sortedDates.map(date => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold font-headline mb-3">{date}</h3>
                        <div className="space-y-3">
                            {groupedByDate[date].map(topic => (
                                <Card key={topic.id} className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{topic.title}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                                In: {topic.subject}
                                            </p>
                                        </div>
                                        <Button asChild variant="ghost">
                                            <Link href={`/topic/${topic.id}`}>Study Topic</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </AppLayout>
  );
}
