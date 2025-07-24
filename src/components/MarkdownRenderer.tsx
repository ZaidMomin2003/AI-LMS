'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: any; // Accept any type to be safe
}

const renderLine = (line: string, lineIndex: number) => {
  // Regex to match **bold** text or `code` snippets
  const regex = /(`.*?`)|(\*\*.*?\*\*)/g;
  const parts = line.split(regex).filter(part => part);

  const renderedParts = parts.map((part, index) => {
    // Handle Code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-muted text-muted-foreground rounded-sm px-1 py-0.5 font-mono">{part.slice(1, -1)}</code>;
    }
    // Handle Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Safety check inspired by user suggestion. This is the fix.
  if (!content || typeof content !== 'string') {
    return null;
  }
  
  const lines = content.split(/\n/g);

  return (
    <>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('1.') || trimmedLine.startsWith('2.') || trimmedLine.startsWith('3.') || trimmedLine.startsWith('4.') || trimmedLine.startsWith('5.')) {
           return <p key={index} className="my-1">{renderLine(line, index)}</p>;
        }
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
           return <li key={index} className="ml-4">{renderLine(trimmedLine.substring(2), index)}</li>;
        }
        if (trimmedLine === '') {
          return <br key={index} />;
        }
        return <p key={index} className="my-1">{renderLine(line, index)}</p>;
      })}
    </>
  );
};
