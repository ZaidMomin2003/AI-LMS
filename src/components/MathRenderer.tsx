
'use client';

import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
}

/**
 * Renders a string containing HTML and KaTeX-formatted math.
 * It finds all instances of `$$...$$` (for block display) and `$...$` (for inline display)
 * and replaces them with HTML rendered by KaTeX.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  // Safety check to ensure content is a string
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Regex to find all instances of $$...$$ or $...$
  const regex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
  
  const processedContent = content.replace(regex, (match, blockEquation, inlineEquation) => {
    const equation = blockEquation || inlineEquation;
    const displayMode = !!blockEquation; // True for block, false for inline

    try {
      return katex.renderToString(equation, {
        throwOnError: false, // Don't crash if there's a syntax error
        displayMode: displayMode,
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return match; // Return the original string on error
    }
  });

  return (
    <div dangerouslySetInnerHTML={{ __html: processedContent }} />
  );
};
