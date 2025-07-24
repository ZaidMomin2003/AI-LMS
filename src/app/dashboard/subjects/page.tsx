
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

export default function SubjectsPage() {
  const { topics, dataLoading } = useTopic();

  const subjects = useMemo(() => {
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

  const sortedSubjectKeys = Object.keys(subjects).sort();

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            My Subjects
          </h2>
          <p className="text-muted-foreground">
            All your generated study materials, organized by subject.
          </p>
        </div>

        {dataLoading && <p>Loading subjects...</p>}

        {!dataLoading && sortedSubjectKeys.length === 0 ? (
          <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <FolderOpen className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline pt-2">No Subjects Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Create a new topic on the dashboard to start organizing your study materials here.
                </p>
            </CardContent>
            <div className="p-6 pt-0">
                <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
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
                      {subjects[subject].length} topics
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    {subjects[subject].map((topic) => (
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </AppLayout>
  );
}
