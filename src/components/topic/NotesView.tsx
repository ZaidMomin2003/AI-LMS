
'use client';

import type { StudyNotes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { BookOpen, List, FlaskConical, Beaker, Lightbulb, FileText, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, { useRef, useState, useEffect } from 'react';
import { explainTextAction } from '@/app/topic/[id]/actions';
import { useToast } from '@/hooks/use-toast';

interface NotesViewProps {
  notes: StudyNotes;
}

const NoteSection = ({ 
    title, 
    content,
    icon: Icon,
    className,
    onTextSelect,
}: { 
    title: string, 
    content: string | null | undefined,
    icon: React.ElementType,
    className?: string,
    onTextSelect: (event: React.MouseEvent<HTMLDivElement>) => void;
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
            <CardContent onMouseUp={onTextSelect} onTouchEnd={onTextSelect}>
                <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                    <MarkdownRenderer content={content} />
                </div>
            </CardContent>
        </Card>
    )
}

export function NotesView({ notes }: NotesViewProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState<EventTarget | null>(null);
  const { toast } = useToast();

  const fullNoteText = React.useMemo(() => {
    if (!notes) return '';
    // Simple concatenation; a more sophisticated version could strip HTML for the context.
    return Object.values(notes).join('\n');
  }, [notes]);

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 2 && text.length < 300) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Create a virtual element for the Popover to target
      const virtualEl = {
          getBoundingClientRect: () => rect,
      };

      // @ts-ignore
      setPopoverTarget(virtualEl);
      setSelectedText(text);
      setPopoverOpen(true);
      setIsLoadingExplanation(true);
      setExplanation('');

      try {
        const result = await explainTextAction({ selectedText: text, contextText: fullNoteText });
        setExplanation(result.explanation);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Explanation Failed',
          description: 'Could not get an explanation for the selected text.',
        });
        setPopoverOpen(false);
      } finally {
        setIsLoadingExplanation(false);
      }
    } else {
      if (popoverOpen) {
        setPopoverOpen(false);
      }
    }
  };
  
  // This is a dummy event handler since the real logic happens in handleTextSelection from the onMouseUp event
  const handleSelect = (event: React.MouseEvent<HTMLDivElement>) => {
      handleTextSelection();
  }


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
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        {/* The entire notes area is now the trigger context, but the popover is controlled manually */}
        <div className="cursor-text">
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pr-4" onMouseUp={handleTextSelection}>
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <NoteSection 
                            title="Introduction" 
                            content={notes.introduction} 
                            icon={BookOpen}
                            onTextSelect={handleSelect}
                        />
                        <NoteSection 
                            title="Core Concepts" 
                            content={notes.coreConcepts} 
                            icon={FileText}
                             onTextSelect={handleSelect}
                        />
                        <NoteSection 
                            title="Summary" 
                            content={notes.summary} 
                            icon={Lightbulb}
                             onTextSelect={handleSelect}
                        />
                    </div>
                    
                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-4">
                        <NoteSection 
                            title="Key Vocabulary" 
                            content={notes.keyVocabulary} 
                            icon={List}
                             onTextSelect={handleSelect}
                        />
                        <NoteSection 
                            title="Key Definitions" 
                            content={notes.keyDefinitions} 
                            icon={List}
                             onTextSelect={handleSelect}
                        />
                        <NoteSection 
                            title="Formulas & Points" 
                            content={notes.keyFormulasOrPoints} 
                            icon={FlaskConical}
                             onTextSelect={handleSelect}
                        />
                        <NoteSection 
                            title="Example" 
                            content={notes.exampleWithExplanation} 
                            icon={Beaker}
                             onTextSelect={handleSelect}
                        />
                    </div>
                </div>
            </ScrollArea>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 shadow-2xl" align="start" side="top" 
      // @ts-ignore
      anchor={popoverTarget}>
        <div className="space-y-2">
          <h4 className="font-medium leading-none flex items-center gap-2 font-headline">
            <Sparkles className="w-5 h-5 text-primary"/>
            Explanation
          </h4>
          <p className="text-sm text-muted-foreground italic">For: "{selectedText}"</p>
          <div className="pt-2">
            {isLoadingExplanation ? (
                <div className="flex items-center justify-center h-20">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            ) : (
                <div className="prose prose-sm prose-invert max-w-none text-foreground">
                    <MarkdownRenderer content={explanation} />
                </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
