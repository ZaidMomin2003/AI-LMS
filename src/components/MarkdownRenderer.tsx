'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Regex to match **bold** text or [links](url)
  const regex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g;
  const parts = content.split(regex).filter(part => part);

  const renderedParts = parts.map((part, index) => {
    // Handle Links
    if (part.startsWith('[') && part.endsWith(')')) {
      const match = /\[(.*?)\]\((.*?)\)/.exec(part);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        return (
          <a href={linkUrl} key={index} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
            {linkText}
          </a>
        );
      }
    }
    // Handle Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    // Handle Regular Text
    return part;
  });

  return <>{renderedParts}</>;
};
