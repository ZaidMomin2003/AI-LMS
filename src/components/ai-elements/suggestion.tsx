
'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconSparkles } from '@tabler/icons-react';
import * as React from 'react';

const Suggestions = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  if (!children) {
    return null;
  }
  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center justify-start gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const Suggestion = ({
  suggestion,
  ...props
}: ButtonProps & { suggestion: string }) => {
  return (
    <Button variant="outline" size="sm" {...props}>
      <IconSparkles className="mr-1 size-3" />
      {suggestion}
    </Button>
  );
};

export { Suggestions, Suggestion };
