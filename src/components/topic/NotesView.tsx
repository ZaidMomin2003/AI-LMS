
'use client';

import type { StudyNotes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { MathRenderer } from '../MathRenderer';
import { BookOpen, List, FlaskConical, Beaker, Lightbulb, FileText, Sparkles, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, from 'react';
import { explainTextAction } from '@/app/topic/[id]/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

interface NotesViewProps {
  notes: StudyNotes;
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

export function NotesView({ notes }: NotesViewProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState('');
  const [explanation, setExplanation] = React.useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = React.useState(false);
  const { toast } = useToast();
  const notesViewRef = React.useRef<HTMLDivElement>(null);
  
  const virtualRef = React.useRef<{ getBoundingClientRect: () => DOMRect } | null>(null);

  const fullNoteText = React.useMemo(() => {
    if (!notes) return '';
    return Object.values(notes).join('\n');
  }, [notes]);

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 2 && text.length < 300 && selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      const parentElement = range.startContainer.parentElement;

      // Ensure the selection is within the notes container
      if (notesViewRef.current && parentElement && notesViewRef.current.contains(parentElement)) {
        
        // Create a virtual element that represents the selection's position
        virtualRef.current = {
          getBoundingClientRect: () => range.getBoundingClientRect(),
        };
        
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
      }
    }
  };
  
  React.useEffect(() => {
    // We only want to close the popover, not open it from here.
    // Opening is handled in `handleTextSelection`.
    const handleMouseUp = () => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        if (!text) {
             setPopoverOpen(false);
        }
    };
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
        document.removeEventListener('mouseup', handleMouseUp);
    }
  }, []);


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
        <PopoverTrigger asChild>
          {/* This div is the virtual trigger for the popover */}
          <div ref={virtualRef as any} />
        </PopoverTrigger>
        <div className="cursor-text" onMouseUp={handleTextSelection} ref={notesViewRef}>
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
                            title="Example" 
                            content={notes.exampleWithExplanation} 
                            icon={Beaker}
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
        <PopoverContent className="w-80 shadow-2xl" sideOffset={8}>
             <div className="space-y-2 relative">
                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={() => setPopoverOpen(false)}>
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
        </PopoverContent>
      </Popover>
    </>
  );
}

