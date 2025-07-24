
'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MarkdownRendererProps {
  content: string;
}

// A component to render interactive key terms from the [[Term|Definition]] format
const KeyTerm = ({ term, definition }: { term: string; definition:string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <span className="text-primary font-semibold cursor-pointer hover:underline">
        {term}
      </span>
    </PopoverTrigger>
    <PopoverContent className="w-64 z-20">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none font-headline">{term}</h4>
          <p className="text-sm text-muted-foreground">{definition}</p>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const renderLineWithLinks = (line: string, lineIndex: number) => {
    // Regex to find all instances of [[Term|Definition]]
    const termRegex = /\[\[(.*?)\|(.*?)\]\]/g;
    const parts = line.split(termRegex);

    if (parts.length <= 1) {
        return line; // No key terms found in this line
    }

    const elements = [];
    for (let i = 0; i < parts.length; i++) {
        // Text parts are at even indices (0, 3, 6, ...)
        if (i % 3 === 0) {
            elements.push(parts[i]);
        } else if (i % 3 === 1) {
            // Term is at index 1, 4, 7, ...
            // Definition is at index 2, 5, 8, ...
            const term = parts[i];
            const definition = parts[i + 1];
            elements.push(<KeyTerm key={`${lineIndex}-${i}`} term={term} definition={definition} />);
        }
    }
    return <>{elements}</>;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Safety check to ensure content is a string
  if (!content || typeof content !== 'string') {
    return null;
  }

  const lines = content.split(/\n/g);

  return (
    <>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        // Basic formatting for lists, etc. can be added here if needed
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 my-1">
              {renderLineWithLinks(trimmedLine.substring(2), index)}
            </li>
          );
        }
        if (trimmedLine === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="my-1">
            {renderLineWithLinks(line, index)}
          </p>
        );
      })}
    </>
  );
};
