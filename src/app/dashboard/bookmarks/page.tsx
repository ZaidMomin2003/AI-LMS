
'use client';

import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import { format } from 'date-fns';
import { Bookmark, Search, History, ArrowRight, Save } from 'lucide-react';
import type { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
      (topic.title && topic.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (topic.subject && topic.subject.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 relative overflow-hidden">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-xl" />
          </div>
          <div className="space-y-6 mt-8">
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-8 pt-6 relative min-h-screen">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/5 blur-[120px] -z-10" />

        <div className="relative z-10 space-y-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                  <Save className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest text-primary/70">Favorites</Badge>
              </div>
              <h2 className="text-4xl font-headline font-black tracking-tight">
                My <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Bookmarks</span>
              </h2>
              <p className="text-muted-foreground font-medium text-lg opacity-80">
                Access your curated collection of saved study materials.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group max-w-2xl">
            <div className="flex items-center gap-2 rounded-full p-1.5 pl-6 border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
              <Search className="h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search your saved topics..."
                className="h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 text-base font-medium placeholder:text-muted-foreground/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {bookmarkedTopics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-16 text-center border-border/40 bg-card/40 backdrop-blur-xl rounded-[3rem] shadow-xl"
            >
              <div className="bg-primary/5 p-6 rounded-full mb-4 border border-primary/10 shadow-inner">
                <Bookmark className="w-12 h-12 text-primary/30" />
              </div>
              <h3 className="text-2xl font-black font-headline tracking-tight mb-2">Empty Sanctuary</h3>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                Your bookmarked treasures will appear here. Start saving your favorite topics to build your collection.
              </p>
              <Button asChild variant="outline" className="mt-6 rounded-full px-8">
                <Link href="/dashboard">Return to Explorer</Link>
              </Button>
            </motion.div>
          ) : filteredTopics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <Search className="w-12 h-12 mb-4" />
              <p className="text-lg font-bold tracking-tight">No bookmarked gems found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedDates.map(date => (
                <div key={date}>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-black font-headline tracking-tight opacity-70">{date}</h3>
                    <div className="h-[1px] flex-1 bg-border/40" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedByDate[date].map(topic => (
                      <Link
                        key={topic.id}
                        href={`/topic/${topic.id}`}
                        className="group relative overflow-hidden flex items-center justify-between p-5 rounded-[1.5rem] border border-border/40 bg-card/30 backdrop-blur-xl hover:border-primary/30 hover:bg-card/50 transition-all duration-300 shadow-sm"
                      >
                        <div className="space-y-1 z-10 flex-1 truncate pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="px-1.5 py-0 text-[9px] uppercase font-black tracking-tighter bg-primary/10 text-primary border-0">
                              {topic.subject}
                            </Badge>
                          </div>
                          <p className="font-bold text-base truncate group-hover:text-primary transition-colors">{topic.title}</p>
                          <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 opacity-60">
                            <History className="w-3.5 h-3.5" />
                            Accessed {format(new Date(topic.createdAt), 'h:mm a')}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 shadow-inner">
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </div>
                        {/* Subtle pattern overlay */}
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                          <Bookmark className="w-12 h-12" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
