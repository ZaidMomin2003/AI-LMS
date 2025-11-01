
'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Renders a string containing HTML content.
 * It uses dangerouslySetInnerHTML to render the content.
 * Ensure that the content is from a trusted source or properly sanitized.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Safety check to ensure content is a string
  if (!content || typeof content !== 'string') {
    return null;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};
