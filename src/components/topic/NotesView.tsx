
'use client';

import type { StudyNotes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MarkdownRenderer } from '../MarkdownRenderer';

interface NotesViewProps {
  notes: StudyNotes;
}

const NoteSection = ({ title, content }: { title: string, content: string | null | undefined }) => {
    if (!content || content.toLowerCase() === 'none') return null;

    return (
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="font-headline text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm prose-invert max-w-none">
                    <MarkdownRenderer content={content} />
                </div>
            </CardContent>
        </Card>
    )
}

export function NotesView({ notes }: NotesViewProps) {
  if (!notes) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No notes available for this topic.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="space-y-4">
            <NoteSection title="Introduction" content={notes.introduction} />
            <NoteSection title="Core Concepts" content={notes.coreConcepts} />
            <NoteSection title="Examples" content={notes.examples} />
            <NoteSection title="Key Formulas" content={notes.keyFormulas} />
            <NoteSection title="Key Terms" content={notes.keyTerms} />
        </div>
    </ScrollArea>
  );
}
