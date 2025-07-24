'use client';

import type { StudyNotes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MarkdownRenderer } from '../MarkdownRenderer';

interface NotesViewProps {
  notes: StudyNotes;
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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Study Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={notes} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
