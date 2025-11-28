
'use client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { IconBrandGoogle, IconQuestionMark } from '@tabler/icons-react';
import * as React from 'react';

const LOGO_MAP: Record<
  string,
  React.ComponentType<React.ComponentProps<'svg'>>
> = {
  google: IconBrandGoogle,
  openai: (props: any) => (
    <svg {...props} viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M490.4 233.7c13.7-12.7 21.6-30.1 21.6-48.4c0-42.3-34.3-76.7-76.7-76.7c-25.1 0-47.5 12.1-61.6 30.8c-10.9-4.3-22.5-6.7-34.8-6.7c-31 0-59.5 13.2-79.3 34.8c-19.8-21.6-48.3-34.8-79.3-34.8c-31 0-59.5 13.2-79.3 34.8c-19.8-21.6-48.3-34.8-79.3-34.8c-42.3 0-76.7 34.3-76.7 76.7c0 18.3 7.9 35.7 21.6 48.4c-13.7 12.7-21.6 30.1-21.6 48.4c0 42.3 34.3 76.7 76.7 76.7c25.1 0 47.5-12.1 61.6-30.8c10.9 4.3 22.5 6.7 34.8 6.7c31 0 59.5-13.2 79.3-34.8c19.8 21.6 48.3 34.8 79.3 34.8c31 0 59.5-13.2 79.3-34.8c19.8 21.6 48.3 34.8 79.3 34.8c42.3 0 76.7-34.3 76.7-76.7c0-18.3-7.9-35.7-21.6-48.4m-126.9 83.2c-14.8 16.3-35.4 26.2-58.1 26.2c-22.7 0-43.3-9.9-58.1-26.2c-7-7.7-12.5-16.8-16.1-26.7c-1.3-3.6-2.1-7.4-2.1-11.3c0-22.7 9.9-43.3 26.2-58.1c7.7-7 16.8-12.5 26.7-16.1c3.6-1.3 7.4-2.1 11.3-2.1c22.7 0 43.3 9.9 58.1 26.2c16.3 14.8 26.2 35.4 26.2 58.1c0 22.7-9.9 43.3-26.2 58.1m-235.6-58.1c0-22.7 9.9-43.3 26.2-58.1c14.8-16.3 35.4-26.2 58.1-26.2c13.7 0 26.7 3.4 37.8 9.4c-12.7 13.9-21.6 31.6-24.9 50.6c-4.3-1-8.7-1.5-13.2-1.5c-22.7 0-43.3 9.9-58.1 26.2c-16.3 14.8-26.2 35.4-26.2 58.1c0 4.6 0.8 9 2.2 13.2c-1.2-1-2.4-2-3.6-3.1c-16.3-14.8-26.2-35.4-26.2-58.1m235.6-46.8c-7-7.7-16.8-12.5-26.7-16.1c-3.6-1.3-7.4-2.1-11.3-2.1c-13.7 0-26.7 3.4-37.8 9.4c12.7 13.9 21.6 31.6 24.9 50.6c4.3-1 8.7-1.5 13.2-1.5c22.7 0 43.3 9.9 58.1 26.2c7.7 7 12.5 16.8 16.1 26.7c1.3 3.6 2.1 7.4 2.1 11.3c0 13.7-3.4 26.7-9.4 37.8c13.9-12.7 31.6-21.6 50.6-24.9c-1-4.3-1.5-8.7-1.5-13.2c0-22.7-9.9-43.3-26.2-58.1m-102.3 11.3c0-4.6-0.8-9-2.2-13.2c1.2 1 2.4 2 3.6 3.1c7 7.7 12.5 16.8 16.1 26.7c1.3 3.6 2.1 7.4 2.1 11.3c0 4.6-0.8 9-2.2 13.2c-1.2-1-2.4-2-3.6-3.1c-7-7.7-12.5-16.8-16.1-26.7c-1.3-3.6-2.1-7.4-2.1-11.3m-16.1-26.7c-7-7.7-12.5-16.8-16.1-26.7c-1.3-3.6-2.1-7.4-2.1-11.3c0-13.7 3.4-26.7 9.4-37.8c-13.9 12.7-31.6 21.6-50.6 24.9c1 4.3 1.5 8.7 1.5 13.2c0 22.7 9.9 43.3 26.2 58.1c7 7.7 16.8 12.5 26.7 16.1c3.6 1.3 7.4 2.1 11.3 2.1c13.7 0 26.7-3.4 37.8-9.4c-12.7-13.9-21.6-31.6-24.9-50.6c-4.3 1-8.7 1.5-13.2 1.5c-4.6 0-9-0.8-13.2-2.2"
      />
    </svg>
  ),
  anthropic: (props: any) => (
    <svg {...props} viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0s256 114.6 256 256m-256-54.2c-5.5 0-10 4.5-10 10v88.4c0 5.5 4.5 10 10 10s10-4.5 10-10v-88.4c0-5.5-4.5-10-10-10m-88.4 0c-5.5 0-10 4.5-10 10v88.4c0 5.5 4.5 10 10 10s10-4.5 10-10v-88.4c0-5.5-4.5-10-10-10m176.8 0c-5.5 0-10 4.5-10 10v88.4c0 5.5 4.5 10 10 10s10-4.5 10-10v-88.4c0-5.5-4.5-10-10-10"
      />
    </svg>
  ),
  azure: (props: any) => (
    <svg {...props} viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M239.7 39.4L68.5 329.8c-9.5 16.3 10.3 34.8 24.9 25.3l102.4-67.4c6.7-4.4 15.3-4.4 22 0l102.4 67.4c14.6 9.6 34.4-9 24.9-25.3L272.3 39.4c-9.6-16.4-32.9-16.4-42.6 0M256 461.7c-9.3 0-18.4-3-26.4-8.7L32.1 316.5C14 305.8 0 317.1 0 336.5v124.9C0 488.9 23.1 512 51.4 512h409.1c28.3 0 51.4-23.1 51.4-51.4V336.5c0-19.4-14-30.7-32.1-11.2L282.4 453c-8 5.7-17.1 8.7-26.4 8.7"
      />
    </svg>
  ),
  'amazon-bedrock': (props: any) => (
    <svg {...props} viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M256.3 400.5c-5.3 0-10.4-1-15.3-3L153.2 349c-2.4-1-5-1-7.4 0L49.3 399.2c-5.1 3-10.9 4.1-16.7 3.5c-15.5-1.5-28.2-14.2-29.6-29.9c-.6-5.8.5-11.6 3.5-16.7l50.2-96.6c1-2.4 1-5 0-7.4L4.8 154.9c-3-5.1-4.1-10.9-3.5-16.7C2.8 122.7 15.5 110 31.1 108.4c5.8-.6 11.6.5 16.7 3.5l96.6 50.2c2.4 1 5 1 7.4 0l96.6-50.2c5.1-3 10.9-4.1 16.7-3.5c15.5 1.5 28.2 14.2 29.6 29.9c.6 5.8-.5 11.6-3.5 16.7l-50.2 96.6c-1 2.4-1 5 0 7.4l50.2 96.6c3 5.1 4.1 10.9 3.5 16.7c-1.5 15.5-14.2 28.2-29.6 29.9c-1.7.2-3.5.3-5.2.3c-3.6 0-7.2-.6-10.6-1.8m-64.8-112.5c2.4-1 5-1 7.4 0l64.6 33.7c4.6 2.4 10.2 2.4 14.8 0l64.6-33.7c2.4-1 5-1 7.4 0l64.6 33.7c4.6 2.4 6.9 7.7 5.7 12.6c-1.2 4.9-5.1 8.5-10.1 8.5h-54.6c-2.4 0-4.6 1-6.2 2.7c-1.6 1.8-2.4 4.1-2.2 6.5l33.7 129.2c1 5.2-2.1 10.4-7.3 11.4c-5.2 1-10.4-2.1-11.4-7.3l-33.7-129.2c-1.6-6.5-6.8-11.4-13.3-12.6c-6.5-1.2-12.8 1.6-16.4 6.5L256 405.3l-31.5-31.5c-3.6-4.9-9.9-7.7-16.4-6.5c-6.5 1.2-11.7 6-13.3 12.6l-33.7 129.2c-1 5.2-6.2 8.3-11.4 7.3c-5.2-1-8.3-6.2-7.3-11.4l33.7-129.2c.3-2.4-.5-4.8-2.2-6.5c-1.6-1.8-3.8-2.7-6.2-2.7H60.4c-5.1 0-8.9-3.6-10.1-8.5c-1.2-4.9 1-10.1 5.7-12.6l64.6-33.7"
      />
    </svg>
  ),
};

const ModelSelector = Popover;

const ModelSelectorTrigger = PopoverTrigger;

const ModelSelectorContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent>
>((props, ref) => {
  return <PopoverContent ref={ref} className="p-0" {...props} />;
});

ModelSelectorContent.displayName = 'ModelSelectorContent';

const ModelSelectorInput: React.FC<
  React.ComponentProps<typeof CommandInput>
> = (props) => {
  return <CommandInput {...props} />;
};

const ModelSelectorList: React.FC<
  React.ComponentProps<typeof CommandList>
> = (props) => {
  return <CommandList {...props} />;
};

const ModelSelectorEmpty: React.FC<
  React.ComponentProps<typeof CommandEmpty>
> = (props) => {
  return <CommandEmpty {...props} />;
};

const ModelSelectorGroup: React.FC<
  React.ComponentProps<typeof CommandGroup>
> = (props) => {
  return <CommandGroup {...props} />;
};

const ModelSelectorItem: React.FC<
  React.ComponentProps<typeof CommandItem>
> = (props) => {
  return <CommandItem {...props} />;
};

const ModelSelectorName: React.FC<
  React.ComponentProps<'div'>
> = (props) => {
  return <div {...props} />;
};

const ModelSelectorLogo = ({
  provider,
  className,
}: { provider: string; className?: string }) => {
  const Logo = LOGO_MAP[provider] || IconQuestionMark;
  return (
    <div
      className={cn('flex size-5 items-center justify-center', className)}
      title={provider}
    >
      <Logo className="size-4" />
    </div>
  );
};

const ModelSelectorLogoGroup = ({
  children,
  className,
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('ml-auto flex items-center gap-0.5', className)}
    >
      {children}
    </div>
  );
};

export {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorName,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
};
