
'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconPencil,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons-react';
import * as React from 'react';
import { toast } from 'sonner';

const MessageContext = React.createContext<{
  from?: 'user' | 'assistant';
  shape?: 'standalone' | 'start' | 'middle' | 'end';
}>({});

const MessageResponseContext = React.createContext<{
  inResponse?: boolean;
}>({
  inResponse: false,
});

const Message = ({
  children,
  className,
  from = 'assistant',
  shape,
  ...props
}: React.ComponentProps<'div'> & {
  from?: 'user' | 'assistant';
  shape?: 'standalone' | 'start' | 'middle' | 'end';
}) => {
  return (
    <MessageContext.Provider value={{ from, shape }}>
      <div
        className={cn(
          'relative flex w-full max-w-2xl gap-3',
          from === 'user' ? 'flex-row-reverse' : 'flex-row',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MessageContext.Provider>
  );
};

const MessageAvatar = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full border bg-card text-card-foreground',
        className
      )}
      {...props}
    />
  );
};

const MessageContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { from } = React.useContext(MessageContext);
  return (
    <div
      className={cn(
        'relative flex w-full flex-col',
        from === 'user' ? 'items-end' : 'items-start',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const MessageResponse = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { from } = React.useContext(MessageContext);
  const contextValue = React.useMemo(() => ({ inResponse: true }), []);

  return (
    <MessageResponseContext.Provider value={contextValue}>
      <div
        className={cn(
          'relative w-fit max-w-full overflow-hidden rounded-2xl border bg-card px-4 py-3 text-card-foreground shadow-sm whitespace-pre-wrap break-words',
          from === 'user'
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MessageResponseContext.Provider>
  );
};

const MessageActions = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { inResponse } = React.useContext(MessageResponseContext);

  if (inResponse) {
    return null;
  }

  return (
    <div className={cn('flex gap-2 pt-2', className)} {...props}>
      {children}
    </div>
  );
};

const MessageAction: React.FC<ButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button
      className={cn('size-7 rounded-lg', className)}
      size="icon"
      variant="ghost"
      {...props}
    />
  );
};

const MessageCopyAction: React.FC<
  Omit<ButtonProps, 'children'> & { value: string }
> = ({ value, ...props }) => {
  return (
    <MessageAction
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard');
      }}
      {...props}
    >
      <IconCopy size={16} />
    </MessageAction>
  );
};

const MessageEditAction: React.FC<Omit<ButtonProps, 'children'>> = (
  props
) => {
  return (
    <MessageAction {...props}>
      <IconPencil size={16} />
    </MessageAction>
  );
};

const MessageRatingActionGroup: React.FC<
  React.ComponentProps<'div'>
> = ({ className, ...props }) => {
  return <div className={cn('flex gap-0.5', className)} {...props} />;
};

const MessageRatingAction: React.FC<
  Omit<ButtonProps, 'children'> & { type: 'up' | 'down' }
> = ({ type, ...props }) => {
  return (
    <MessageAction {...props}>
      {type === 'up' ? (
        <IconThumbUp size={16} />
      ) : (
        <IconThumbDown size={16} />
      )}
    </MessageAction>
  );
};

type MessageBranchContextType = {
  current: number;
  total: number;
  onSelect: (index: number) => void;
};

const MessageBranchContext =
  React.createContext<MessageBranchContextType | null>(null);

const MessageBranch = ({
  children,
  className,
  defaultBranch = 0,
  ...props
}: React.ComponentProps<'div'> & { defaultBranch?: number }) => {
  const [selected, setSelected] = React.useState(defaultBranch);
  const total = React.Children.count(
    (
      React.Children.toArray(children).find(
        (child) =>
          React.isValidElement(child) && child.type === MessageBranchContent
      ) as React.ReactElement
    )?.props.children
  );

  return (
    <MessageBranchContext.Provider
      value={{ current: selected, total, onSelect: setSelected }}
    >
      <div className={cn('flex flex-col items-center', className)} {...props}>
        {children}
      </div>
    </MessageBranchContext.Provider>
  );
};

const MessageBranchContent = ({
  children,
}: React.ComponentProps<'div'>) => {
  const { current } = React.useContext(
    MessageBranchContext
  ) as MessageBranchContextType;
  const childArray = React.Children.toArray(children);
  return <>{childArray[current]}</>;
};

const MessageBranchSelector = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & { from?: 'user' | 'assistant' }) => {
  const { from } = React.useContext(MessageContext);
  return (
    <div
      className={cn(
        'relative -mt-2 flex w-full items-center justify-center gap-1 p-0',
        from === 'user' ? 'flex-row-reverse' : 'flex-row',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const MessageBranchPrevious: React.FC<
  Omit<ButtonProps, 'children'>
> = (props) => {
  const { current, onSelect } = React.useContext(
    MessageBranchContext
  ) as MessageBranchContextType;
  return (
    <Button
      className="size-5 rounded-full"
      disabled={current === 0}
      onClick={() => onSelect(current - 1)}
      size="icon"
      variant="ghost"
      {...props}
    >
      <IconChevronLeft size={16} />
    </Button>
  );
};

const MessageBranchNext: React.FC<Omit<ButtonProps, 'children'>> = (
  props
) => {
  const { current, total, onSelect } = React.useContext(
    MessageBranchContext
  ) as MessageBranchContextType;
  return (
    <Button
      className="size-5 rounded-full"
      disabled={current === total - 1}
      onClick={() => onSelect(current + 1)}
      size="icon"
      variant="ghost"
      {...props}
    >
      <IconChevronRight size={16} />
    </Button>
  );
};

const MessageBranchPage: React.FC<React.ComponentProps<'div'>> = (
  props
) => {
  const { current, total } = React.useContext(
    MessageBranchContext
  ) as MessageBranchContextType;
  return (
    <div className="text-xs text-muted-foreground" {...props}>
      {current + 1} / {total}
    </div>
  );
};

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
  MessageCopyAction,
  MessageEditAction,
  MessageRatingAction,
  MessageRatingActionGroup,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
};
