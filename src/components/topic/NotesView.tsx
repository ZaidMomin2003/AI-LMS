
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
import { useIsMobile } from '@/hooks/use-mobile';


interface NotesViewProps {
    notes: StudyNotes;
    explainTextAction: (input: ExplainTextInput) => Promise<ExplainTextOutput>;
}

const Sentence = ({ text, onSentenceClick }: { text: string, onSentenceClick: (sentence: string) => void }) => {
    return (
        <span
            className="cursor-pointer hover:bg-primary/10 transition-colors rounded"
            onClick={() => onSentenceClick(text)}
        >
            {text}
        </span>
    );
};

const ProcessedContent = ({ htmlContent, onSentenceClick }: { htmlContent: string, onSentenceClick: (sentence: string) => void }) => {
    if (!htmlContent) return null;
    const parts = htmlContent.split(/(?<![A-Z].)\. /g);

    return (
        <>
            {parts.map((part, index) => {
                const isLastPart = index === parts.length - 1;
                const sentence = isLastPart ? part : part + '. ';
                return (
                    <Sentence key={index} text={sentence} onSentenceClick={onSentenceClick} />
                );
            })}
        </>
    )
}

const NoteSection = ({
    title,
    content,
    icon: Icon,
    className,
    isMobile,
    onSentenceClick,
}: {
    title: string,
    content: string | null | undefined,
    icon: React.ElementType,
    className?: string,
    isMobile: boolean,
    onSentenceClick: (sentence: string) => void,
}) => {
    if (!content || content.toLowerCase() === '<p>none</p>' || content.toLowerCase() === 'none') return null;

    const renderContent = () => {
        if (isMobile) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textOnly = tempDiv.textContent || tempDiv.innerText || '';
            return <ProcessedContent htmlContent={textOnly} onSentenceClick={onSentenceClick} />;
        }
        return <MathRenderer content={content} />;
    }

    return (
        <Card className={cn("bg-card/40 backdrop-blur-xl border-border/10 shadow-lg rounded-2xl overflow-hidden relative group transition-all hover:bg-card/60", className)}>
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-20" />
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 border-b border-border/5">
                <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
                    <Icon className="w-4 h-4" />
                </div>
                <CardTitle className="font-black text-xs uppercase tracking-[0.2em] opacity-80">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed font-medium">
                    {renderContent()}
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
    const isMobile = useIsMobile();

    const fullNoteText = React.useMemo(() => {
        if (!notes) return '';
        return Object.values(notes).join('\n');
    }, [notes]);

    const handleTextSelection = useCallback(() => {
        if (isMobile) return; // Don't run this logic on mobile

        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 2 && text.length < 500 && selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            const parentElement = range.startContainer.parentElement;

            if (notesViewRef.current && parentElement && notesViewRef.current.contains(parentElement)) {
                virtualRef.current = {
                    getBoundingClientRect: () => range.getBoundingClientRect(),
                };

                setSelectedText(text);
                setPopoverContent('options');
                setPopoverOpen(true);
            }
        } else if (!popoverOpen) {
            // Only close if we are not already in an explanation popover
            setPopoverOpen(false);
        }
    }, [isMobile, popoverOpen]);

    const triggerExplanation = (text: string) => {
        setSelectedText(text);
        setPopoverContent('explanation');
        setPopoverOpen(true);
        setIsLoadingExplanation(true);
        setExplanation('');

        explainTextAction({ selectedText: text, contextText: fullNoteText })
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

    const handleExplain = () => {
        triggerExplanation(selectedText);
    };

    useEffect(() => {
        if (isMobile) return; // Only apply this logic for desktop

        const notesView = notesViewRef.current;
        if (notesView) {
            const handleMouseUp = () => handleTextSelection();

            notesView.addEventListener('mouseup', handleMouseUp);
            notesView.addEventListener('touchend', handleMouseUp);

            return () => {
                notesView.removeEventListener('mouseup', handleMouseUp);
                notesView.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [handleTextSelection, isMobile]);

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
                <div ref={notesViewRef}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <NoteSection
                                title="Introduction"
                                content={notes.introduction}
                                icon={BookOpen}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                            <NoteSection
                                title="Example"
                                content={notes.exampleWithExplanation}
                                icon={Beaker}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                            <NoteSection
                                title="Core Concepts"
                                content={notes.coreConcepts}
                                icon={FileText}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                            <NoteSection
                                title="Summary"
                                content={notes.summary}
                                icon={Lightbulb}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <NoteSection
                                title="Key Vocabulary"
                                content={notes.keyVocabulary}
                                icon={List}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                            <NoteSection
                                title="Key Definitions"
                                content={notes.keyDefinitions}
                                icon={List}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                            <NoteSection
                                title="Formulas & Points"
                                content={notes.keyFormulasOrPoints}
                                icon={FlaskConical}
                                isMobile={isMobile}
                                onSentenceClick={triggerExplanation}
                            />
                        </div>
                    </div>
                </div>
                <PopoverContent className="w-auto shadow-2xl p-0" sideOffset={8}>
                    {popoverContent === 'options' ? (
                        <div className="flex rounded-md border bg-background">
                            <Button variant="ghost" onClick={handleExplain} className="p-3 h-auto rounded-md">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span className="ml-2 font-semibold">Explain</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col w-80 bg-popover">
                            <div className="p-4 space-y-2 relative">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setPopoverOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                                <h4 className="font-medium leading-none flex items-center gap-2 font-headline">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Explanation
                                </h4>
                                <p className="text-sm text-muted-foreground italic truncate">For: "{selectedText}"</p>
                            </div>
                            <div className="flex-1 px-4 pb-4">
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
