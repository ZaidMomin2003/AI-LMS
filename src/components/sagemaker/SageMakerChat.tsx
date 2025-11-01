
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ImageIcon,
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
  User,
  Bot,
  Mic,
  Lock,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { sageMakerAction } from '@/app/dashboard/sagemaker/actions';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { Skeleton } from '../ui/skeleton';


// --- TYPES AND INTERFACES ---

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}


// --- HOOKS ---

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback((reset?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    textarea.style.height = 'auto'; // Reset height to recalculate
    const newHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
    );
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

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
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn('relative', containerClassName)}>
        <textarea
          className={cn(
            'border-input bg-background flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm',
            'transition-all duration-200 ease-in-out',
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            showRing ? 'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none' : '',
            className,
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showRing && isFocused && (
          <motion.span
            className="ring-primary/30 pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

function TypingDots() {
  return (
    <div className="ml-1 flex items-center">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="bg-primary mx-0.5 h-1.5 w-1.5 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}


// --- MAIN CHAT COMPONENT ---

export default function SageMakerChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 24, maxHeight: 200 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
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
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            toast({ variant: "destructive", title: "Voice Recognition Error", description: `Error: ${event.error}` });
        };
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
      }
    }
  }, [toast]);

  // --- Handlers ---
  
  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
         toast({ variant: "destructive", title: "Not Supported", description: "Your browser may not support voice recognition." });
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 4MB." });
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
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    const prompt = input.trim();
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
      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
      toast({ variant: "destructive", title: "An error occurred", description: "Could not get a response from the AI." });
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

  // --- Access Control ---

  if (subscriptionLoading) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
               <Skeleton className="w-full max-w-3xl h-[85vh]"/>
          </div>
      )
  }
  
  const sageMakerAllowed = subscription?.planName && ['Hobby', 'Scholar Subscription', 'Sage Mode'].includes(subscription.planName);

  if (!sageMakerAllowed) {
      return (
           <div className="flex h-screen w-full items-center justify-center bg-background p-4">
               <Card className="w-full max-w-md text-center shadow-2xl">
                 <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                        <Lock className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline pt-4 text-2xl">SageMaker is a Premium Feature</CardTitle>
                    <p className="text-muted-foreground pt-2">Upgrade your plan for unlimited access to your personal AI study assistant.</p>
                 </CardHeader>
                 <CardContent>
                    <Button asChild size="lg"><Link href="/pricing"><Star className="mr-2 h-5 w-5" />Upgrade to Pro</Link></Button>
                 </CardContent>
               </Card>
          </div>
      )
  }

  // --- Render ---

  return (
    <div className="flex h-screen w-full max-w-4xl flex-col">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-card p-4 shadow-xl border">
        
        {/* Chat Messages Area */}
        <div ref={chatContainerRef} className="flex-1 space-y-6 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
              {message.role === 'assistant' && (
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full"><Bot size={18} /></div>
              )}
              <div className={cn(
                "max-w-[75%] rounded-2xl p-4",
                message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary rounded-bl-none'
              )}>
                 {message.image && <Image src={message.image} alt="User upload" width={200} height={200} className="rounded-lg mb-2" />}
                 {message.role === 'assistant' ? (
                    <div className="whitespace-pre-wrap text-sm"><MarkdownRenderer content={message.content} /></div>
                 ) : (
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                 )}
              </div>
              {message.role === 'user' && (
                <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full"><User size={18} /></div>
              )}
            </div>
          ))}
          
          <AnimatePresence>
            {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full"><Bot size={18} /></div>
                        <div className="flex items-center gap-2 rounded-2xl bg-secondary p-4 rounded-bl-none">
                            <TypingDots />
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Input Area */}
        <div className="mt-auto border-t p-4">
          <div className="relative">
             <AnimatePresence>
              {imagePreview && (
                <motion.div
                  className="mb-3 w-fit"
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 10 }}
                >
                    <div className="relative">
                        <Image src={imagePreview} alt="Preview" width={60} height={60} className="rounded-md object-cover border" />
                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-muted-foreground text-background rounded-full p-0.5">
                            <XIcon size={12} />
                        </button>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, or use the mic..."
              className="resize-none w-full border rounded-lg p-3 pr-28 text-sm"
              showRing={false}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isTyping || isRecording}>
                    <Paperclip size={18} />
                 </Button>
                 <Button type="button" variant={isRecording ? "destructive" : "ghost"} size="icon" onClick={handleMicClick} disabled={isTyping}>
                    <Mic size={18} />
                 </Button>
                <Button type="submit" size="icon" disabled={isTyping || (!input.trim() && !imageData)} onClick={handleSendMessage}>
                  {isTyping ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <SendIcon size={18} />}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
