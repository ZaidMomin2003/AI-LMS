
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
import { FolderOpen, History } from 'lucide-react';
import Link from 'next/link';
import { AddSubjectForm } from '@/components/subjects/AddSubjectForm';
import { useSubject } from '@/context/SubjectContext';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            My Subjects
          </h2>
          <p className="text-muted-foreground">
            Manage your subjects and browse your generated study materials.
          </p>
        </div>
        
        <AddSubjectForm onAddSubject={addSubject} />

        {topicsLoading || subjectsLoading ? (
            <SubjectSkeleton />
        ) : sortedSubjectKeys.length === 0 ? (
          <Card className="text-center mt-6">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <FolderOpen className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline pt-2">No Subjects Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Add a new subject above to start organizing your study materials.
                </p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {sortedSubjectKeys.map((subject) => (
              <AccordionItem value={subject} key={subject} className="border bg-card rounded-lg">
                <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    <span>{subject}</span>
                    <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                      {subjectsWithTopics[subject]?.length || 0} topics
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                    {subjectsWithTopics[subject] && subjectsWithTopics[subject].length > 0 ? (
                        <div className="space-y-3">
                            {subjectsWithTopics[subject].map((topic) => (
                            <div
                                key={topic.id}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-secondary"
                            >
                                <div>
                                <p className="font-medium">{topic.title}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <History className="w-3.5 h-3.5" />
                                    Created {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                                </p>
                                </div>
                                <Button asChild variant="ghost">
                                <Link href={`/topic/${topic.id}`}>Study Topic</Link>
                                </Button>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No topics created for this subject yet.</p>
                    )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </AppLayout>
  );
}
