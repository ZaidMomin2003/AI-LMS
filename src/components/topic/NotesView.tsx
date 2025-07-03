'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import type { KeyTerm } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface NotesViewProps {
  notes: string;
  keyTerms: KeyTerm[];
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const renderParts = (parts: string[], keyTerms: KeyTerm[], baseKey: string) => {
  return parts.map((part, partIndex) => {
    // Find a matching term, case-insensitively
    const matchedTerm = keyTerms.find(
      (kt) => kt.term.toLowerCase() === part.toLowerCase()
    );

    if (matchedTerm) {
      return (
        <Popover key={`${baseKey}-${partIndex}`}>
          <PopoverTrigger asChild>
            <span className="text-primary font-semibold cursor-pointer hover:underline">
              {part}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80 z-50">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none font-headline">
                  {matchedTerm.term}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {matchedTerm.definition}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    return <React.Fragment key={`${baseKey}-${partIndex}`}>{part}</React.Fragment>;
  });
};


export function NotesView({ notes, keyTerms }: NotesViewProps) {
  const renderNotes = (text: string) => {
    const termsRegex =
      keyTerms && keyTerms.length > 0
        ? new RegExp(`(${keyTerms.map((kt) => escapeRegex(kt.term)).join('|')})`, 'gi')
        : null;

    return text.split('\n').map((line, index) => {
      const key = `line-${index}`;
      
      const renderLineContent = (content: string) => {
        if (!termsRegex || !content) return <>{content}</>;
        const parts = content.split(termsRegex);
        return renderParts(parts, keyTerms, key);
      };

      if (line.startsWith('### ')) {
        return <h3 key={key} className="text-lg font-headline mt-4 mb-2">{renderLineContent(line.substring(4))}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={key} className="text-xl font-headline mt-6 mb-3 border-b pb-2">{renderLineContent(line.substring(3))}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={key} className="text-2xl font-headline mt-8 mb-4 border-b pb-2">{renderLineContent(line.substring(2))}</h1>;
      }
      if (line.startsWith('* ')) {
        return <li key={key} className="ml-4 list-disc">{renderLineContent(line.substring(2))}</li>;
      }
      if (line.trim() === '') {
        return <br key={key} />;
      }
      return <p key={key} className="my-1">{renderLineContent(line)}</p>;
    });
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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Study Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
          <div className="prose prose-invert max-w-none">
            {renderNotes(notes)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
