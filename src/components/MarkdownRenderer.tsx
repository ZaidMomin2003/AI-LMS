
'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MarkdownRendererProps {
  content: string;
  keyTerms?: string; // keyTerms is optional now
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


const processLine = (line: string) => {
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;

  // Regex to find all instances of [[Term|Definition]]
  const termRegex = /\[\[(.*?)\|(.*?)\]\]/g;
  let match;
  while ((match = termRegex.exec(line)) !== null) {
    // Push the text before the match
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }
    // Push the KeyTerm component
    const [fullMatch, term, definition] = match;
    parts.push(<KeyTerm key={`${term}-${match.index}`} term={term} definition={definition} />);
    lastIndex = match.index + fullMatch.length;
  }
  // Push the remaining text after the last match
  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts;
};


export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Safety check to ensure content is a string
  if (!content || typeof content !== 'string') {
    return null;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-2">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{processLine(trimmedLine.substring(4))}</h3>);
    } else if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-semibold mt-6 mb-3 border-b pb-2">{processLine(trimmedLine.substring(3))}</h2>);
    } else if (trimmedLine.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold mt-8 mb-4">{processLine(trimmedLine.substring(2))}</h1>);
    } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      listItems.push(<li key={index}>{processLine(trimmedLine.substring(2))}</li>);
    } else if (trimmedLine === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={index} className="my-2">{processLine(line)}</p>);
    }
  });
  
  flushList(); // Ensure any trailing list gets rendered

  return <>{elements}</>;
};
