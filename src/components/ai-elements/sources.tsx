
'use client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { IconBook } from '@tabler/icons-react';
import * as React from 'react';

const Sources = Popover;

const SourcesTrigger: React.FC<
  Omit<React.ComponentProps<typeof Button>, 'children'> & { count: number }
> = ({ className, count, ...props }) => {
  return (
    <PopoverTrigger asChild>
      <Button
        className={cn('h-7 gap-1 rounded-lg px-2 text-sm', className)}
        size="sm"
        variant="ghost"
        {...props}
      >
        <IconBook size={16} />
        {count}
      </Button>
    </PopoverTrigger>
  );
};

const SourcesContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) => {
  return (
    <PopoverContent
      className={cn(
        'max-w-96 space-y-1 rounded-xl p-1 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </PopoverContent>
  );
};

const Source = ({
  href,
  title,
  ...props
}: React.ComponentProps<'a'> & { href: string; title: string }) => {
  return (
    <a
      className="block w-full truncate rounded-md p-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...props}
    >
      {title}
    </a>
  );
};

export { Sources, SourcesTrigger, SourcesContent, Source };
