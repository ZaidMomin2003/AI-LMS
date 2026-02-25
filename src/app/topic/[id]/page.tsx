
'use client';

import { AppLayout } from '@/components/AppLayout';
import { FlashcardsView } from '@/components/topic/FlashcardsView';
import { NotesView } from '@/components/topic/NotesView';
import { QuizView } from '@/components/topic/QuizView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTopic } from '@/context/TopicContext';
import { FileText, BrainCircuit, MessageCircleQuestion, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Topic } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { explainTextAction } from './actions';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { createShareableTopic } from '@/services/firestore';


export default function TopicPage() {
  const params = useParams();
  const { getTopicById, toggleBookmark } = useTopic();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const { toast } = useToast();
  const id = params.id as string;

  useEffect(() => {
    if (typeof id === 'string') {
      const foundTopic = getTopicById(id);
      setTopic(foundTopic ?? null);
    }
  }, [id, getTopicById]);

  const handleShare = async () => {
    if (topic && user) {
      try {
        const shareableId = await createShareableTopic(topic, user.uid);
        const shareUrl = `${window.location.origin}/share/${shareableId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Share Link Copied!",
            description: "A public link to this topic has been copied to your clipboard.",
          });
        }).catch(err => {
          toast({
            variant: "destructive",
            title: "Failed to Copy",
            description: "Could not copy the link. Please try again.",
          });
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Sharing Failed",
          description: (error as Error).message || "Could not create a shareable link for this topic.",
        });
      }
    }
  };

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
      <div className="flex-1 relative bg-background">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/10 px-4 md:px-8 pt-6 pb-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="rounded-xl border-border/10 bg-background/50 hover:bg-background/80 transition-all">
                  <Link href="/dashboard/subjects"><ArrowLeft size={18} /></Link>
                </Button>
                <div className="space-y-0.5">
                  <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tighter leading-none">
                    {topic.title}
                  </h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                    Neural Syllabus Integrated
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-xl border-border/10 bg-background/50 hover:bg-primary/10 hover:border-primary/20 transition-all font-bold group"
                >
                  <Share2 className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={cn(
                    "rounded-xl border-border/10 bg-background/50 transition-all font-bold",
                    topic.isBookmarked ? "text-primary border-primary/20 bg-primary/5" : "hover:bg-primary/10 hover:border-primary/20 hover:text-primary"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4 mr-2", topic.isBookmarked && "fill-primary")} />
                  {topic.isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="bg-background/40 backdrop-blur-xl border border-border/10 p-1 rounded-2xl h-12 w-fit">
                <TabsTrigger value="notes" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest px-6 h-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest px-6 h-full">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="quiz" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-widest px-6 h-full">
                  <MessageCircleQuestion className="mr-2 h-4 w-4" />
                  Quiz
                </TabsTrigger>
              </TabsList>

              {/* Notes - scrolls naturally */}
              <TabsContent value="notes" className="mt-0 outline-none border-none p-0">
                <div className="p-0 pt-6 pb-16">
                  <NotesView notes={topic.notes} explainTextAction={explainTextAction} />
                </div>
              </TabsContent>

              {/* Flashcards - centered in remaining viewport */}
              <TabsContent value="flashcards" className="mt-0 outline-none border-none p-0">
                <div className="flex items-center justify-center min-h-[60vh] py-8">
                  <FlashcardsView flashcards={topic.flashcards} />
                </div>
              </TabsContent>

              {/* Quiz - immediately below tabs */}
              <TabsContent value="quiz" className="mt-0 outline-none border-none p-0">
                <div className="pt-6 pb-16">
                  <QuizView quiz={topic.quiz} topicId={topic.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
