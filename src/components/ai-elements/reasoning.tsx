
'use client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { IconSparkles } from '@tabler/icons-react';
import * as React from 'react';

const Reasoning = Popover;

const ReasoningTrigger: React.FC<
  Omit<React.ComponentProps<typeof Button>, 'children'>
> = ({ className, ...props }) => {
  return (
    <PopoverTrigger asChild>
      <Button
        className={cn('size-7 rounded-lg', className)}
        size="icon"
        variant="ghost"
        {...props}
      >
        <IconSparkles size={16} />
      </Button>
    </PopoverTrigger>
  );
};

const ReasoningContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) => {
  return (
    <PopoverContent
      className={cn(
        'max-w-96 rounded-xl p-3 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      <div className="font-mono text-xs">{children}</div>
    </PopoverContent>
  );
};

export { Reasoning, ReasoningTrigger, ReasoningContent };
