
'use client';

import type { StudyNotes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { BookOpen, List, FlaskConical, Beaker, Lightbulb, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotesViewProps {
  notes: StudyNotes;
}

const NoteSection = ({ 
    title, 
    content,
    icon: Icon,
    className
}: { 
    title: string, 
    content: string | null | undefined,
    icon: React.ElementType,
    className?: string,
}) => {
    if (!content || content.toLowerCase() === '<p>none</p>' || content.toLowerCase() === 'none') return null;

    return (
        <Card className={cn("bg-secondary/30 border-border/50", className)}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="font-headline text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
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
    <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pr-4">
           {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
                <NoteSection 
                    title="Introduction" 
                    content={notes.introduction} 
                    icon={BookOpen}
                />
                <NoteSection 
                    title="Core Concepts" 
                    content={notes.coreConcepts} 
                    icon={FileText}
                />
                 <NoteSection 
                    title="Summary" 
                    content={notes.summary} 
                    icon={Lightbulb}
                />
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-4">
                 <NoteSection 
                    title="Key Vocabulary" 
                    content={notes.keyVocabulary} 
                    icon={List}
                />
                 <NoteSection 
                    title="Key Definitions" 
                    content={notes.keyDefinitions} 
                    icon={List}
                />
                 <NoteSection 
                    title="Formulas & Points" 
                    content={notes.keyFormulasOrPoints} 
                    icon={FlaskConical}
                />
                <NoteSection 
                    title="Example" 
                    content={notes.exampleWithExplanation} 
                    icon={Beaker}
                />
            </div>
        </div>
    </ScrollArea>
  );
}
