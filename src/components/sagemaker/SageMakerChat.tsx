
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  User,
  Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { sageMakerAction } from '@/app/dashboard/sagemaker/actions';
import { Button } from '../ui/button';
import { MarkdownRenderer } from '../MarkdownRenderer';

// --- TYPES AND INTERFACES ---

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

// --- HOOKS ---

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = 'auto'; // Reset height to recalculate
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

// --- UI COMPONENTS ---

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input bg-transparent flex w-full rounded-md px-3 text-sm',
          'transition-all duration-200 ease-in-out',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="h-2 w-2 rounded-full bg-foreground/50"
          initial={{ y: 0 }}
          animate={{ y: [-2, 2, -2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const PromptSuggestionCard = ({ text, onClick }: { text: string, onClick: (text: string) => void }) => (
    <Button variant="outline" className="h-auto whitespace-normal text-left justify-start" onClick={() => onClick(text)}>
        {text}
    </Button>
);


// --- MAIN CHAT COMPONENT ---

export default function SageMakerChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  const { toast } = useToast();

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 24,
    maxHeight: 200,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  // --- Handlers ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (promptOverride?: string) => {
    const prompt = promptOverride || input.trim();
    if (!prompt && !imageData) return;

    setIsTyping(true);
    setInput('');
    adjustHeight(true);

    const userMessage: Message = { role: 'user', content: prompt };
    if (imagePreview) {
      userMessage.image = imagePreview;
    }
    setMessages((prev) => [...prev, userMessage]);
    removeImage();

    try {
      const response = await sageMakerAction({
        prompt: prompt,
        imageDataUri: imageData,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.response },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I encountered an error. Please try again." },
      ]);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not get a response from the AI.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (text: string) => {
    setInput(text);
    handleSendMessage(text);
  };

  // --- Render ---

  return (
    <div className="flex h-full w-full flex-col bg-card border rounded-xl overflow-hidden">
      {/* Chat Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center text-center h-full pt-16">
              <div className="bg-primary/10 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl font-bold font-headline">
                How can I help you today?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
                <PromptSuggestionCard text="Explain quantum computing in simple terms" onClick={handleSuggestionClick} />
                <PromptSuggestionCard text="Write a thank-you email to a hiring manager" onClick={handleSuggestionClick} />
                <PromptSuggestionCard text="Give me 3 startup ideas in the AI space" onClick={handleSuggestionClick} />
                <PromptSuggestionCard text="Summarize the plot of 'The Great Gatsby'" onClick={handleSuggestionClick} />
              </div>
            </div>
          ) : (
             <div className="space-y-8">
                {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                        {message.role === 'assistant' ? <Sparkles size={18} /> : <User size={18} />}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm capitalize">{message.role}</p>
                        {message.image && (
                            <div className="my-2">
                                <Image
                                src={message.image}
                                alt="User upload"
                                width={200}
                                height={200}
                                className="rounded-lg border"
                                />
                            </div>
                        )}
                        <div className="prose prose-sm prose-invert max-w-none text-foreground/90">
                           <MarkdownRenderer content={message.content} />
                        </div>
                    </div>
                </div>
                ))}
             </div>
          )}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-start gap-4 mt-8"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Sparkles size={18} />
                </div>
                <div className="flex-1 mt-3">
                   <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="mt-auto px-4 pb-4">
        <div className="max-w-3xl mx-auto">
            <div className="relative rounded-xl border bg-background shadow-lg">
                <AnimatePresence>
                {imagePreview && (
                    <motion.div
                    className="p-4"
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 10 }}
                    >
                    <div className="relative w-fit">
                        <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-md object-cover border"
                        />
                        <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-muted text-muted-foreground rounded-full p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                        >
                        <XIcon size={14} />
                        </button>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>

                <div className="flex items-center p-2.5">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isTyping}
                        className="flex-shrink-0"
                    >
                        <Paperclip size={18} />
                    </Button>
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        onChange={(e) => {
                            setInput(e.target.value);
                            adjustHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Message SageMaker..."
                        className="resize-none max-h-[200px] border-0 shadow-none focus-visible:ring-0"
                    />
                    <AnimatePresence>
                        {input.trim() && (
                             <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isTyping || (!input.trim() && !imageData)}
                                    onClick={() => handleSendMessage()}
                                    className="rounded-full flex-shrink-0 w-8 h-8"
                                >
                                    {isTyping ? (
                                    <LoaderIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                    <SendIcon size={16} />
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
             <p className="text-xs text-center text-muted-foreground mt-2">
                SageMaker may produce inaccurate information about people, places, or facts.
            </p>
        </div>
      </div>
    </div>
  );
}
