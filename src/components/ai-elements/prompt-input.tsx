
'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  IconArrowUp,
  IconCirclePlus,
  IconPaperclip,
  IconPlus,
  IconTemplate,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import * as React from 'react';

export type PromptInputMessage = {
  text?: string;
  files?: File[];
};

type ContextType = {
  attachments: File[];
  addAttachments: (files: File[]) => void;
  removeAttachment: (index: number) => void;
  dropZoneActive: boolean;
  setDropZoneActive: (active: boolean) => void;
  multiple?: boolean;
};

const Context = React.createContext<ContextType | null>(null);

const useContext = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within a PromptInput');
  }
  return context;
};

const PromptInput = ({
  children,
  className,
  globalDrop = false,
  multiple = false,
  onSubmit,
  ...props
}: React.ComponentProps<'form'> & {
  globalDrop?: boolean;
  multiple?: boolean;
  onSubmit: (message: PromptInputMessage) => void;
}) => {
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [dropZoneActive, setDropZoneActive] = React.useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const addAttachments = (files: File[]) => {
    if (multiple) {
      setAttachments((prev) => [...prev, ...files]);
    } else {
      setAttachments(files.slice(0, 1));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = formData.get('prompt') as string;
    onSubmit({ text, files: attachments });
    setAttachments([]); // Clear attachments after submit
  };

  const handleGlobalDrop = React.useCallback((event: DragEvent) => {
    event.preventDefault();
    setDropZoneActive(false);
    if (event.dataTransfer?.files) {
      addAttachments(Array.from(event.dataTransfer.files));
    }
  }, []);

  const handleGlobalDragOver = React.useCallback((event: DragEvent) => {
    event.preventDefault();
    setDropZoneActive(true);
  }, []);

  const handleGlobalDragLeave = React.useCallback((event: DragEvent) => {
    const relatedTarget = event.relatedTarget as Node;
    if (
      !relatedTarget ||
      (formRef.current && !formRef.current.contains(relatedTarget))
    ) {
      setDropZoneActive(false);
    }
  }, []);

  React.useEffect(() => {
    if (globalDrop) {
      document.addEventListener('drop', handleGlobalDrop);
      document.addEventListener('dragover', handleGlobalDragOver);
      document.addEventListener('dragleave', handleGlobalDragLeave);

      return () => {
        document.removeEventListener('drop', handleGlobalDrop);
        document.removeEventListener('dragover', handleGlobalDragOver);
        document.removeEventListener('dragleave', handleGlobalDragLeave);
      };
    }
  }, [globalDrop, handleGlobalDrop, handleGlobalDragOver, handleGlobalDragLeave]);

  return (
    <Context.Provider
      value={{
        attachments,
        addAttachments,
        removeAttachment,
        dropZoneActive,
        setDropZoneActive,
        multiple,
      }}
    >
      <form
        ref={formRef}
        className={cn(
          'relative w-full rounded-xl border bg-background transition-colors focus-within:border-ring',
          className
        )}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
        {globalDrop && (
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] border-2 border-dashed border-primary bg-background/50 text-sm font-medium text-primary backdrop-blur-sm transition-opacity',
              dropZoneActive ? 'opacity-100' : 'opacity-0'
            )}
          >
            <IconCirclePlus size={16} className="mr-1" />
            Drop files to attach
          </div>
        )}
      </form>
    </Context.Provider>
  );
};

const PromptInputBody = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return <div className={cn('relative p-2', className)} {...props} />;
};

const PromptInputHeader = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { attachments } = useContext();
  if (attachments.length === 0) {
    return null;
  }
  return (
    <div
      className={cn('relative flex w-full p-2', className)}
      {...props}
    />
  );
};

const PromptInputAttachments = ({
  children,
}: {
  children: (attachment: {
    file: File;
    remove: () => void;
  }) => React.ReactNode;
}) => {
  const { attachments, removeAttachment } = useContext();
  if (!attachments.length) {
    return null;
  }
  return (
    <div className="flex gap-2 overflow-x-auto">
      {attachments.map((file, index) =>
        children({ file, remove: () => removeAttachment(index) })
      )}
    </div>
  );
};

const PromptInputAttachment = ({
  data,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  data: { file: File; remove: () => void };
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data.file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(data.file);
    }
  }, [data.file]);

  return (
    <div
      className={cn(
        'group relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border text-xs text-muted-foreground',
        className
      )}
      {...props}
    >
      {preview ? (
        <img
          src={preview}
          alt={data.file.name}
          className="size-full object-cover"
        />
      ) : (
        <IconPaperclip size={16} />
      )}
      <Button
        className="absolute right-1 top-1 size-4 shrink-0 rounded-full p-0 opacity-0 group-hover:opacity-100"
        onClick={data.remove}
        size="icon"
        variant="secondary"
        type="button"
      >
        <IconX size={12} />
      </Button>
    </div>
  );
};

const PromptInputFooter = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex items-center p-2 pt-0', className)}
      {...props}
    />
  );
};

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => {
  const { setDropZoneActive } = useContext();

  const handleDragOver = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setDropZoneActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setDropZoneActive(false);
  };

  return (
    <Textarea
      ref={ref}
      name="prompt"
      className={cn(
        'min-h-10 w-full resize-none rounded-md border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      {...props}
    />
  );
});

PromptInputTextarea.displayName = 'PromptInputTextarea';

const PromptInputTools = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  );
};

const PromptInputButton: React.FC<ButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button
      className={cn('size-8 shrink-0 rounded-lg', className)}
      size="icon"
      variant="ghost"
      type="button"
      {...props}
    />
  );
};

const PromptInputSubmit = ({
  status,
  ...props
}: ButtonProps & {
  status?: 'submitted' | 'streaming' | 'ready' | 'error';
}) => {
  return (
    <Button
      className="ml-auto size-8 shrink-0 rounded-lg"
      size="icon"
      type="submit"
      {...props}
    >
      <IconArrowUp size={16} />
    </Button>
  );
};

const PromptInputActionMenu: React.FC<
  React.ComponentProps<typeof DropdownMenu>
> = (props) => {
  return <DropdownMenu {...props} />;
};

const PromptInputActionMenuTrigger: React.FC<
  React.ComponentProps<typeof PromptInputButton>
> = (props) => {
  return (
    <DropdownMenuTrigger asChild>
      <PromptInputButton {...props}>
        <IconPlus size={16} />
      </PromptInputButton>
    </DropdownMenuTrigger>
  );
};

const PromptInputActionMenuContent: React.FC<
  React.ComponentProps<typeof DropdownMenuContent>
> = ({ className, ...props }) => {
  return (
    <DropdownMenuContent
      className={cn('w-48 rounded-xl p-1', className)}
      {...props}
    />
  );
};

const PromptInputActionMenuGroup: React.FC<
  React.ComponentProps<typeof DropdownMenuGroup>
> = ({ className, ...props }) => {
  return (
    <DropdownMenuGroup
      className={cn('space-y-0.5', className)}
      {...props}
    />
  );
};

const PromptInputActionMenuItem: React.FC<
  React.ComponentProps<typeof DropdownMenuItem>
> = ({ className, ...props }) => {
  return (
    <DropdownMenuItem
      className={cn('rounded-lg text-sm', className)}
      {...props}
    />
  );
};

const PromptInputActionAddAttachments: React.FC<
  Omit<React.ComponentProps<typeof DropdownMenuItem>, 'children'>
> = (props) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addAttachments, multiple } = useContext();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addAttachments(Array.from(event.target.files));
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        multiple={multiple}
        onChange={handleFileSelect}
      />
      <DropdownMenuItem
        className="gap-2"
        onClick={() => fileInputRef.current?.click()}
        {...props}
      >
        <IconPaperclip size={16} />
        <span>Attach Files</span>
      </DropdownMenuItem>
    </>
  );
};

const PromptInputActionAddTemplate: React.FC<
  Omit<React.ComponentProps<typeof DropdownMenuItem>, 'children'>
> = (props) => {
  return (
    <DropdownMenuItem className="gap-2" {...props}>
      <IconTemplate size={16} />
      <span>Use Template</span>
    </DropdownMenuItem>
  );
};

const PromptInputActionClearAttachments: React.FC<
  Omit<React.ComponentProps<typeof DropdownMenuItem>, 'children'>
> = (props) => {
  const { attachments, setDropZoneActive } = useContext();
  if (attachments.length === 0) {
    return null;
  }
  return (
    <DropdownMenuItem
      className="gap-2"
      onClick={() => setDropZoneActive(false)}
      {...props}
    >
      <IconTrash size={16} />
      <span>Clear Attachments</span>
    </DropdownMenuItem>
  );
};

export {
  PromptInput,
  PromptInputBody,
  PromptInputHeader,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuGroup,
  PromptInputActionMenuItem,
  PromptInputActionAddAttachments,
  PromptInputActionAddTemplate,
  PromptInputActionClearAttachments,
};
