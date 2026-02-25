
'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components/AppLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopic } from '@/context/TopicContext';
import type { Topic } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { FolderOpen, History, ArrowRight, Library, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { AddSubjectForm } from '@/components/subjects/AddSubjectForm';
import { useSubject } from '@/context/SubjectContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function SubjectsPage() {
  const { topics, dataLoading: topicsLoading } = useTopic();
  const { subjects: subjectList, addSubject, loading: subjectsLoading } = useSubject();

  const subjectsWithTopics = useMemo(() => {
    if (!topics) return {};
    return topics.reduce((acc: Record<string, Topic[]>, topic) => {
      const subjectKey = topic.subject || 'Uncategorized';
      if (!acc[subjectKey]) {
        acc[subjectKey] = [];
      }
      acc[subjectKey].push(topic);
      return acc;
    }, {});
  }, [topics]);

  const sortedSubjectKeys = Array.from(new Set([...subjectList, ...Object.keys(subjectsWithTopics)]))
    .filter(s => s !== 'Uncategorized')
    .sort();

  const SubjectSkeleton = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
      ))}
    </div>
  );

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-8 pt-6 relative items-start min-h-screen">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/5 blur-[120px] -z-10" />

        <div className="relative z-10 space-y-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                <Library className="h-5 w-5" />
              </div>
              <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest text-primary/70">Library</Badge>
            </div>
            <h2 className="text-4xl font-headline font-black tracking-tight">
              Study <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Subjects</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg opacity-80">
              Your organized knowledge base. Manage your areas of expertise.
            </p>
          </div>

          <AddSubjectForm onAddSubject={addSubject} />

          {topicsLoading || subjectsLoading ? (
            <SubjectSkeleton />
          ) : sortedSubjectKeys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-12 text-center border-border/40 bg-card/40 backdrop-blur-xl rounded-[2.5rem] shadow-xl"
            >
              <div className="bg-primary/5 p-6 rounded-full mb-4 border border-primary/10 shadow-inner">
                <FolderOpen className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black font-headline tracking-tight mb-2">No subjects yet</h3>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                Add your first subject above to start organizing your study materials with Wisdom.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-3 border-0">
                {sortedSubjectKeys.map((subject) => (
                  <AccordionItem value={subject} key={subject} className="border border-border/40 bg-card/40 backdrop-blur-xl rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-primary/20">
                    <AccordionTrigger className="px-6 py-5 text-xl font-black font-headline tracking-tight hover:no-underline hover:bg-primary/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-left">{subject}</span>
                        <Badge variant="secondary" className="bg-background/50 border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
                          {subjectsWithTopics[subject]?.length || 0} Lessons
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      {subjectsWithTopics[subject] && subjectsWithTopics[subject].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {subjectsWithTopics[subject].map((topic) => (
                            <Link
                              key={topic.id}
                              href={`/topic/${topic.id}`}
                              className="group flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/20 hover:border-primary/30 hover:bg-background/50 transition-all duration-300 shadow-sm"
                            >
                              <div className="space-y-1 overflow-hidden pr-2">
                                <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{topic.title}</p>
                                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 opacity-60">
                                  <History className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                <ArrowRight className="h-4 w-4 text-primary" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-background/20 rounded-2xl border border-dashed border-border/50">
                          <PlusCircle className="h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                          <p className="text-sm font-medium text-muted-foreground opacity-60">No lessons generated for this subject yet.</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
