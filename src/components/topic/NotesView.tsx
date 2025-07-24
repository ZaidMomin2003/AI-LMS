'use client';

import React from 'react';
import type { StudyNotes } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BookOpen, Brain, FlaskConical, Lightbulb, ListOrdered } from 'lucide-react';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { Separator } from '../ui/separator';

interface NotesViewProps {
  notes: StudyNotes;
}

const TermPopover: React.FC<{ term: string, definition: string, children: React.ReactNode }> = ({ term, definition, children }) => (
  <Popover>
    <PopoverTrigger asChild>{children}</PopoverTrigger>
    <PopoverContent className="w-80 z-50">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none font-headline">{term}</h4>
          <p className="text-sm text-muted-foreground">{definition}</p>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const HighlightedMarkdownRenderer: React.FC<{ content: string; keyTerms: StudyNotes['keyTerms'] }> = ({ content, keyTerms }) => {
  const terms = keyTerms ?? [];
  const termsRegex = terms.length > 0
    ? new RegExp(`(${terms.map(kt => kt.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
    : null;

  if (!termsRegex) {
    return <MarkdownRenderer content={content} />;
  }
  
  const parts = content.split(termsRegex);

  return (
    <>
      {parts.map((part, index) => {
        const matchedTerm = terms.find(kt => kt.term.toLowerCase() === part.toLowerCase());
        if (matchedTerm) {
          return (
            <TermPopover key={index} term={matchedTerm.term} definition={matchedTerm.definition}>
              <span className="text-primary font-semibold cursor-pointer hover:underline">{part}</span>
            </TermPopover>
          );
        }
        return <MarkdownRenderer key={index} content={part} />;
      })}
    </>
  );
};


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

  const keyTerms = notes.keyTerms ?? [];

  return (
    <div className="space-y-6">
        {/* Introduction */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Introduction
                </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
                <HighlightedMarkdownRenderer content={notes.introduction} keyTerms={keyTerms} />
            </CardContent>
        </Card>
        
        {/* Main Content in a grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Explanation */}
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <ListOrdered className="w-5 h-5 text-primary" />
                            Detailed Explanation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="prose prose-invert max-w-none">
                               <HighlightedMarkdownRenderer content={notes.detailedExplanation} keyTerms={keyTerms} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            
            {/* Examples */}
            {notes.examples && notes.examples.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-primary" />
                            Examples
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {notes.examples.map((example, index) => (
                            <div key={index}>
                                <h4 className="font-semibold">{example.title}</h4>
                                <div className="text-sm text-muted-foreground prose prose-invert max-w-none">
                                    <HighlightedMarkdownRenderer content={example.explanation} keyTerms={keyTerms} />
                                </div>
                                {index < notes.examples.length - 1 && <Separator className="my-4"/>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Formulas & Mnemonics Side-by-Side */}
            <div className="space-y-6">
                {notes.formulas && notes.formulas.length > 0 && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" />
                                Key Formulas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notes.formulas.map((formula, index) => (
                                <div key={index}>
                                    <p className="font-mono text-primary bg-muted p-2 rounded-md text-center">{formula.formula}</p>
                                    <p className="text-sm mt-2 text-muted-foreground"><span className="font-semibold text-foreground">{formula.name}:</span> {formula.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
                {notes.mnemonics && notes.mnemonics.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-primary" />
                                Mnemonics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notes.mnemonics.map((item, index) => (
                                <div key={index}>
                                    <p className="font-semibold">{item.concept}</p>
                                    <p className="italic text-primary">"{item.mnemonic}"</p>
                                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
