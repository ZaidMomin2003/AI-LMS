
'use client';

import { AppLayout } from '@/components/AppLayout';
import { FlashcardsView } from '@/components/topic/FlashcardsView';
import { NotesView } from '@/components/topic/NotesView';
import { QuizView } from '@/components/topic/QuizView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTopic } from '@/context/TopicContext';
import { FileText, BrainCircuit, MessageCircleQuestion, ArrowLeft, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Topic } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function TopicPage() {
  const params = useParams();
  const { getTopicById, toggleBookmark } = useTopic();
  const [topic, setTopic] = useState<Topic | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof params.id === 'string') {
      const foundTopic = getTopicById(params.id);
      setTopic(foundTopic ?? null);
    }
  }, [params.id, getTopicById]);
  
  const handleBookmark = () => {
    if (topic) {
        toggleBookmark(topic.id);
        const newBookmarkedState = !topic.isBookmarked;
        // Update local state immediately for UI responsiveness
        setTopic(prev => prev ? { ...prev, isBookmarked: newBookmarkedState } : null);
        toast({
            title: newBookmarkedState ? 'Bookmarked!' : 'Bookmark Removed',
            description: `"${topic.title}" has been ${newBookmarkedState ? 'added to' : 'removed from'} your bookmarks.`,
        });
    }
  };

  if (!topic) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl text-muted-foreground">Topic not found.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard">Go back to Dashboard</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/subjects"><ArrowLeft/></Link>
                </Button>
                <h2 className="text-3xl font-headline font-bold tracking-tight">
                    {topic.title}
                </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleBookmark} aria-label="Bookmark topic">
                <Bookmark className={cn("w-6 h-6 text-muted-foreground transition-colors", topic.isBookmarked && "fill-primary text-primary")} />
            </Button>
        </div>
        <Tabs defaultValue="notes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notes">
              <FileText className="mr-2 h-4 w-4" />
              Study Notes
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <MessageCircleQuestion className="mr-2 h-4 w-4" />
              Quiz
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="space-y-4">
            <NotesView notes={topic.notes} />
          </TabsContent>
          <TabsContent value="flashcards" className="space-y-4">
            <FlashcardsView flashcards={topic.flashcards} />
          </TabsContent>
          <TabsContent value="quiz" className="space-y-4">
            <QuizView quiz={topic.quiz} topicId={topic.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
