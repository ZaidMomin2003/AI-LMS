
'use client';

import type { StudyNotes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MathRenderer } from '../MathRenderer';
import { BookOpen, List, FlaskConical, Beaker, Lightbulb, FileText, Sparkles, Loader2, X, Highlighter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { PopoverAnchor } from '@radix-ui/react-popover';
import type { ExplainTextInput, ExplainTextOutput } from '@/ai/flows/explain-text-flow';
import { Separator } from '../ui/separator';

interface NotesViewProps {
  notes: StudyNotes;
  explainTextAction: (input: ExplainTextInput) => Promise<ExplainTextOutput>;
}

const NoteSection = ({ 
    title, 
    content,
    icon: Icon,
    className,
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
                <div className="prose prose-sm prose-invert max-w-none text-foreground">
                    <MathRenderer content={content} />
                </div>
            </CardContent>
        </Card>
    )
}

export function NotesView({ notes, explainTextAction }: NotesViewProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverContent, setPopoverContent] = useState<'options' | 'explanation'>('options');
  const [selectedText, setSelectedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const { toast } = useToast();
  const notesViewRef = useRef<HTMLDivElement>(null);
  const virtualRef = useRef<{ getBoundingClientRect: () => DOMRect } | null>(null);
  const rangeRef = useRef<Range | null>(null);

  const fullNoteText = React.useMemo(() => {
    if (!notes) return '';
    return Object.values(notes).join('\n');
  }, [notes]);
  
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 2 && text.length < 500 && selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const parentElement = range.startContainer.parentElement;

        if (notesViewRef.current && parentElement && notesViewRef.current.contains(parentElement)) {
            virtualRef.current = {
                getBoundingClientRect: () => range.getBoundingClientRect(),
            };
            rangeRef.current = range.cloneRange();
            
            setSelectedText(text);
            setPopoverContent('options');
            setPopoverOpen(true);
        }
    } else {
        setPopoverOpen(false);
    }
  }, []);
  
  useEffect(() => {
    const viewRef = notesViewRef.current;
    if (!viewRef) return;
    
    const handlePointerUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          handleTextSelection();
        } else {
          if (popoverOpen) {
            setPopoverOpen(false);
          }
        }
      }, 10);
    };

    viewRef.addEventListener('pointerup', handlePointerUp);
    
    return () => {
        viewRef.removeEventListener('pointerup', handlePointerUp);
    }
  }, [handleTextSelection, popoverOpen]);

  const handleExplain = () => {
    setPopoverContent('explanation');
    setIsLoadingExplanation(true);
    setExplanation('');

    explainTextAction({ selectedText, contextText: fullNoteText })
      .then(result => {
        setExplanation(result.explanation);
      })
      .catch(error => {
        toast({
            variant: 'destructive',
            title: 'Explanation Failed',
            description: 'Could not get an explanation for the selected text.',
        });
        setPopoverOpen(false);
      })
      .finally(() => {
        setIsLoadingExplanation(false);
      });
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // This is a more robust way to highlight content.
    // `surroundContents` fails if the selection spans across different block elements.
    // This approach creates a new element and replaces the content.
    try {
        const mark = document.createElement('mark');
        mark.className = "bg-yellow-300/70 text-foreground";
        
        // This will wrap the selected content in the mark tag, even if it spans multiple nodes.
        mark.appendChild(range.extractContents());
        range.insertNode(mark);
        
    } catch (e) {
        console.error("Highlighting failed:", e);
        toast({
            variant: "destructive",
            title: "Highlight Failed",
            description: "An unexpected error occurred while highlighting."
        });
    } finally {
        window.getSelection()?.removeAllRanges();
        setPopoverOpen(false);
    }
  };


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
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverAnchor asChild>
          <div ref={virtualRef as any} />
        </PopoverAnchor>
        <div className="cursor-text" ref={notesViewRef}>
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
                            title="Example" 
                            content={notes.exampleWithExplanation} 
                            icon={Beaker}
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
                    </div>
                </div>
            </ScrollArea>
        </div>
        <PopoverContent className="w-auto shadow-2xl p-0" sideOffset={8}>
            {popoverContent === 'options' ? (
                <div className="flex rounded-md border bg-background">
                    <Button variant="ghost" onClick={handleHighlight} className="p-3 h-auto rounded-r-none">
                        <Highlighter className="w-5 h-5"/>
                        <span className="ml-2 font-semibold">Highlight</span>
                    </Button>
                    <Separator orientation="vertical" className="h-auto"/>
                    <Button variant="ghost" onClick={handleExplain} className="p-3 h-auto rounded-l-none">
                        <Sparkles className="w-5 h-5 text-primary"/>
                        <span className="ml-2 font-semibold">Explain</span>
                    </Button>
                </div>
            ) : (
             <div className="space-y-2 p-4 w-80 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setPopoverOpen(false)}>
                    <X className="w-4 h-4"/>
                </Button>
                <h4 className="font-medium leading-none flex items-center gap-2 font-headline">
                    <Sparkles className="w-5 h-5 text-primary"/>
                    Explanation
                </h4>
                <p className="text-sm text-muted-foreground italic truncate">For: "{selectedText}"</p>
                <div className="pt-2">
                    {isLoadingExplanation ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ScrollArea className="h-full max-h-60 pr-4">
                            <div className="prose prose-sm prose-invert max-w-none text-foreground">
                                <MathRenderer content={explanation} />
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
            )}
        </PopoverContent>
      </Popover>
    </>
  );
}
