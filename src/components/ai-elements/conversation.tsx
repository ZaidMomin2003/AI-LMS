
'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconArrowDown } from '@tabler/icons-react';
import * as React from 'react';

const Conversation = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('relative h-full w-full', className)} {...props}>
      {children}
    </div>
  );
};

const ConversationContent = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col-reverse overflow-y-auto',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-5 px-4 pb-8 pt-4">{props.children}</div>
    </div>
  );
};

const ConversationScrollButton = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      className={cn(
        'absolute bottom-4 right-4 z-10 size-10 rounded-full',
        className
      )}
      size="icon"
      variant="outline"
      {...props}
    >
      <IconArrowDown size={16} />
    </Button>
  );
};

export { Conversation, ConversationContent, ConversationScrollButton };
