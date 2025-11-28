
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconAdjustmentsHorizontal,
  IconArrowUp,
  IconBook,
  IconBrain,
  IconFileText,
  IconHistory,
  IconPaperclip,
  IconPlayerPlay,
  IconPlus,
  IconSparkles,
  IconTemplate,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";
import { nanoid } from 'nanoid';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

import { Bot, LoaderIcon, User } from "lucide-react";
import { MarkdownRenderer } from "../MarkdownRenderer";
import type { WisdomGptInput } from "@/ai/flows/wisdom-gpt-flow";
import { wisdomGptAction } from "@/app/dashboard/wisdomgpt/actions";


interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

const ACTIONS = [
  { id: "explain-concept", icon: IconSparkles, label: "Explain a concept" },
  { id: "summarize-chapter", icon: IconBook, label: "Summarize a chapter" },
  { id: "practice-problems", icon: IconBrain, label: "Create practice problems" },
  { id: "create-flashcards", icon: IconFileText, label: "Generate flashcards" },
];

export default function WisdomGptChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    explainSimple: true,
    includeExamples: false,
    suggestFollowUp: false,
  });

   useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);


  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSendMessage = async (promptOverride?: string) => {
    const currentInput = promptOverride || input.trim();
    if (!currentInput && !imageData) return;

    setIsTyping(true);
    setInput("");

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: currentInput,
      ...(imagePreview && { image: imagePreview }),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    const currentImageData = imageData;
    setImageData(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";

    try {
        const aiInput: WisdomGptInput = { prompt: currentInput };
        if (currentImageData) {
            aiInput.imageDataUri = currentImageData;
        }
        
      const response = await wisdomGptAction(aiInput);

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
          variant: 'destructive',
          title: "AI Error",
          description: "Could not get a response. Please try again."
      });
       const errorMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please check the console and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (actionId: string) => {
    const prompts: { [key: string]: string } = {
        'explain-concept': "Explain the concept of [Your Topic] in simple terms. Include a real-world example to help me understand.",
        'summarize-chapter': "Summarize the key points of [Chapter Title or Topic]. Focus on the main ideas and takeaways.",
        'practice-problems': "Create 5 practice problems based on [Your Topic]. Include a mix of difficulties.",
        'create-flashcards': "Generate a set of 10 flashcards for [Your Topic], with a term on the front and a definition on the back."
    };
    const newPrompt = prompts[actionId] || "";
    setInput(newPrompt);
  };
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Please upload an image smaller than 4MB."
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
    
    const handleRemoveFile = () => {
        setImageData(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


  return (
    <div className="flex h-full w-full flex-col">
      {/* Scrollable chat messages area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
            {messages.length === 0 && !isTyping ? (
                 <div className="flex flex-col items-center justify-center text-center h-full pt-16">
                     <div className="bg-primary/10 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                        <IconSparkles size={28} />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">
                        WisdomGPT
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Your personal AI tutor for any subject
                    </p>
                 </div>
            ) : messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                    <div key={message.id} className={cn("flex items-start gap-4", isUser && "justify-end")}>
                    {!isUser && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <Bot size={18} />
                        </div>
                    )}
                        <div className={cn("flex-1 max-w-[80%]", isUser && "text-right")}>
                            <div className={cn(
                                "p-3 rounded-2xl inline-block",
                                isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary rounded-bl-none"
                            )}>
                                {message.image && (
                                    <div className="mb-2">
                                        <Image
                                            src={message.image}
                                            alt="User upload"
                                            width={200}
                                            height={200}
                                            className="rounded-lg border"
                                        />
                                    </div>
                                )}
                                <div className="prose prose-sm prose-invert max-w-none text-current whitespace-pre-wrap break-words">
                                    <MarkdownRenderer content={message.content} />
                                </div>
                            </div>
                        </div>
                        {isUser && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <User size={18} />
                        </div>
                    )}
                    </div>
                )
            })}
             <AnimatePresence>
                {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-start gap-4"
                >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                    <div className="flex-1 mt-3">
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
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Fixed input area */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 pb-4">
            {messages.length === 0 && !isTyping && (
                <div className="max-w-xs sm:max-w-md mx-auto flex-wrap gap-2 flex min-h-0 shrink-0 items-center justify-center pb-4">
                {ACTIONS.map((action) => (
                    <Button
                    className="gap-2 rounded-full"
                    key={action.id}
                    size="sm"
                    variant="outline"
                    onClick={() => handleActionClick(action.id)}
                    >
                    <action.icon size={16} />
                    {action.label}
                    </Button>
                ))}
                </div>
            )}
            <form
            className="overflow-visible rounded-xl border bg-card p-2 transition-colors duration-200 focus-within:border-ring"
            onSubmit={handleSubmit}
            >
            {imagePreview && (
                <div className="relative flex w-fit items-center gap-2 mb-2">
                    <Badge
                    variant="outline"
                    className="group relative h-16 w-16 cursor-default overflow-hidden p-0"
                    >
                    <Image
                        alt="Preview"
                        className="absolute inset-0 h-full w-full rounded-sm object-cover"
                        src={imagePreview}
                        layout="fill"
                    />
                    <button
                        className="absolute right-1 top-1 z-10 rounded-full p-0.5 bg-background/50 text-foreground opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                        onClick={handleRemoveFile}
                        type="button"
                    >
                        <IconX size={12} />
                    </button>
                    </Badge>
                </div>
            )}
            <Textarea
                className="max-h-50 min-h-12 resize-none rounded-none border-none bg-transparent p-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your studies..."
                value={input}
            />

            <div className="flex items-center gap-1">
                <div className="flex items-end gap-0.5 sm:gap-1">
                <input
                    className="sr-only"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        className="ml-[-2px] h-7 w-7 rounded-md"
                        size="icon"
                        type="button"
                        variant="ghost"
                    >
                        <IconPlus size={16} />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    align="start"
                    className="max-w-xs rounded-xl p-1"
                    >
                    <DropdownMenuGroup className="space-y-1">
                        <DropdownMenuItem
                        className="rounded-md text-sm"
                        onClick={() => fileInputRef.current?.click()}
                        >
                        <div className="flex items-center gap-2">
                            <IconPaperclip className="text-muted-foreground" size={16} />
                            <span>Attach Image</span>
                        </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-md text-sm">
                        <div className="flex items-center gap-2">
                            <IconTemplate className="text-muted-foreground" size={16} />
                            <span>Use Template</span>
                        </div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        className="size-7 rounded-md"
                        size="icon"
                        type="button"
                        variant="ghost"
                    >
                        <IconAdjustmentsHorizontal size={16} />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    align="start"
                    className="w-56 rounded-xl p-3"
                    >
                    <DropdownMenuGroup className="space-y-3">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconSparkles className="text-muted-foreground" size={16} />
                            <Label className="text-xs">Explain Like I'm 10</Label>
                        </div>
                        <Switch
                            checked={settings.explainSimple}
                            className="scale-75"
                            onCheckedChange={(value) =>
                            updateSetting("explainSimple", value)
                            }
                        />
                        </div>

                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconPlayerPlay className="text-muted-foreground" size={16} />
                            <Label className="text-xs">Include Examples</Label>
                        </div>
                        <Switch
                            checked={settings.includeExamples}
                            className="scale-75"
                            onCheckedChange={(value) =>
                            updateSetting("includeExamples", value)
                            }
                        />
                        </div>

                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconHistory className="text-muted-foreground" size={16} />
                            <Label className="text-xs">Suggest Follow-up</Label>
                        </div>
                        <Switch
                            checked={settings.suggestFollowUp}
                            className="scale-75"
                            onCheckedChange={(value) =>
                            updateSetting("suggestFollowUp", value)
                            }
                        />
                        </div>
                    </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>

                <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
                <Button
                    className="h-7 w-7 rounded-md"
                    disabled={(!input.trim() && !imageData) || isTyping}
                    size="icon"
                    type="submit"
                    variant="default"
                >
                    {isTyping ? <LoaderIcon className="h-4 w-4 animate-spin"/> : <IconArrowUp size={16} />}
                </Button>
                </div>
            </div>
            </form>
        </div>
       </div>
    </div>
  );
}
