
'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MarkdownRendererProps {
  content: any; // Accept any type to be safe
  keyTerms?: string; // Optional string of key terms and definitions
}

// A component to render interactive key terms
const KeyTerm = ({ term, definition }: { term: string; definition: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <span className="text-primary font-semibold cursor-pointer hover:underline">
          {term}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-64 z-20">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">
              {term}
            </h4>
            <p className="text-sm text-muted-foreground">
              {definition}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
);


const renderLine = (line: string, lineIndex: number, keyTermsMap: Map<string, string>) => {
  // Regex to match **bold** text, `code` snippets, or one of the key terms
  const termsRegex = keyTermsMap.size > 0 ? `|(${Array.from(keyTermsMap.keys()).join('|')})` : '';
  const regex = new RegExp(`(\`.*?\`)|(\\*\\*.*?\\*\\*)${termsRegex}`, 'g');
  
  const parts = line.split(regex).filter(part => part);

  const renderedParts = parts.map((part, index) => {
    // Handle Key Terms
    if (keyTermsMap.has(part)) {
        return <KeyTerm key={`${lineIndex}-${index}`} term={part} definition={keyTermsMap.get(part)!} />;
    }
    // Handle Code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${lineIndex}-${index}`} className="bg-muted text-muted-foreground rounded-sm px-1 py-0.5 font-mono">{part.slice(1, -1)}</code>;
    }
    // Handle Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${lineIndex}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    // Handle Regular Text
    return part;
  });
  
  // Regex to match [links](url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;

  // Process for links separately
  const finalParts = renderedParts.map((part, index) => {
    if (typeof part !== 'string') return part; // It's already a component

    const linkParts = part.split(linkRegex).filter(p => p);
    if (linkParts.length <= 1) return part;

    let result = [];
    for (let i = 0; i < linkParts.length; i += 3) {
      if (linkParts[i]) result.push(linkParts[i]); // Text before link
      if (linkParts[i+1] && linkParts[i+2]) { // Link text and URL
        result.push(
          <a href={linkParts[i+2]} key={`${lineIndex}-link-${i}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
            {linkParts[i+1]}
          </a>
        );
      }
    }
    return result;
  });

  return <React.Fragment key={lineIndex}>{finalParts}</React.Fragment>;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, keyTerms }) => {
  // Safety check to ensure content is a string
  if (!content || typeof content !== 'string') {
    return null;
  }
  
  // Parse key terms into a Map for easy lookup
  const keyTermsMap = new Map<string, string>();
  if (keyTerms && typeof keyTerms === 'string') {
    const termLines = keyTerms.split('\n');
    termLines.forEach(line => {
        const match = line.match(/^\s*[\*-]\s*([^:]+):\s*(.*)/);
        if (match) {
            const [, term, definition] = match;
            keyTermsMap.set(term.trim(), definition.trim());
        }
    });
  }
  
  const lines = content.split(/\n/g);

  return (
    <>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (/^\d+\./.test(trimmedLine)) { // Matches ordered lists like "1."
           return <p key={index} className="my-1">{renderLine(line, index, keyTermsMap)}</p>;
        }
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
           return <li key={index} className="ml-4">{renderLine(trimmedLine.substring(2), index, keyTermsMap)}</li>;
        }
        if (trimmedLine === '') {
          return <br key={index} />;
        }
        return <p key={index} className="my-1">{renderLine(line, index, keyTermsMap)}</p>;
      })}
    </>
  );
};
