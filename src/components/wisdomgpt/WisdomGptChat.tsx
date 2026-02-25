
'use client';

import * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
    IconHistory,
    IconPaperclip,
    IconPlayerPlay,
    IconSparkles,
    IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { nanoid } from 'nanoid';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

import { Bot, FileQuestion, LoaderIcon, User } from "lucide-react";
import { MathRenderer } from "../MathRenderer";
import type { WisdomGptInput } from "@/ai/flows/wisdom-gpt-flow";
import { wisdomGptAction } from "@/app/dashboard/wisdomgpt/actions";
import { useTopic } from "@/context/TopicContext";
import type { Topic } from "@/types";


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
    { id: "practice-questions", icon: FileQuestion, label: "Give me 5 practice questions for AP Biology" },
];


export default function WisdomGptChat() {
    const { topics } = useTopic();
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
        suggestFollowUp: true,
    });

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

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

    const handleSendMessage = useCallback(async (promptOverride?: string) => {
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
        if (fileInputRef.current) fileInputRef.current.value = "";

        let notesContext: string | undefined = undefined;
        if (selectedNoteId) {
            const selectedTopic = topics.find(t => t.id === selectedNoteId);
            if (selectedTopic) {
                notesContext = Object.values(selectedTopic.notes).join('\n\n');
            }
        }


        try {
            const aiInput: WisdomGptInput = {
                prompt: currentInput,
                settings: settings,
                ...(notesContext && { notesContext }),
            };
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
    }, [input, imageData, imagePreview, settings, toast, selectedNoteId, topics]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleActionClick = (actionId: string) => {
        const prompts: { [key: string]: string } = {
            'explain-concept': "Explain the concept of [Your Topic] in simple terms. Include a real-world example to help me understand.",
            'summarize-chapter': "Summarize the key points of [Chapter Title or Topic]. Focus on the main ideas and takeaways.",
            'practice-problems': "Create 5 practice problems based on [Your Topic]. Include a mix of difficulties.",
            'practice-questions': "Give me 5 practice questions for AP Biology",
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

    // This effect handles clicking on follow-up buttons
    useEffect(() => {
        const handleFollowUpClick = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('button.follow-up-btn')) {
                const question = target.textContent;
                if (question) {
                    handleSendMessage(question);
                }
            }
        };

        const chatEl = chatContainerRef.current;
        chatEl?.addEventListener('click', handleFollowUpClick);

        return () => {
            chatEl?.removeEventListener('click', handleFollowUpClick);
        };
    }, [handleSendMessage]);

    const selectedTopicForBadge = useMemo(() => {
        if (!selectedNoteId) return null;
        return topics.find(t => t.id === selectedNoteId);
    }, [selectedNoteId, topics]);

    return (
        <div className="flex h-full w-full flex-col relative overflow-hidden">
            {/* Scrollable chat messages area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 md:gap-10 px-4 md:px-6 py-6 md:py-12">
                    {messages.length === 0 && !isTyping ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center justify-center text-center h-[50vh] md:h-[60vh] px-4"
                        >
                            <div className="relative group mb-6 md:mb-8">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <div className="bg-primary/10 text-primary p-4 md:p-6 rounded-3xl border border-primary/20 backdrop-blur-xl relative z-10">
                                    <IconSparkles size={32} stroke={1.5} className="md:w-12 md:h-12" />
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-[0.9] mb-4 md:mb-6">
                                Study with <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">WisdomGPT</span>
                            </h2>
                            <p className="text-muted-foreground font-medium text-sm md:text-lg max-w-md mx-auto opacity-70">
                                Ask about any subject, summarize notes, or generate practice questions instantly.
                            </p>

                            <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-3">
                                {ACTIONS.map((action, idx) => (
                                    <motion.button
                                        key={action.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        onClick={() => handleActionClick(action.id)}
                                        className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 border border-border/40 backdrop-blur-md hover:border-primary/40 hover:bg-primary/5 transition-all text-xs md:text-sm font-bold tracking-tight"
                                    >
                                        <action.icon size={16} className="text-primary md:w-[18px] md:h-[18px]" />
                                        {action.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-6 md:space-y-10">
                            {messages.map((message) => {
                                const isUser = message.role === 'user';
                                return (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}
                                    >
                                        <div className={cn("flex items-start gap-2 max-w-[90%] md:max-w-[85%]", isUser && "flex-row-reverse")}>
                                            <div className={cn(
                                                "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm",
                                                isUser ? "bg-card border border-border/40 text-muted-foreground" : "bg-primary/10 border border-primary/10 text-primary"
                                            )}>
                                                {isUser ? <User size={16} /> : <Bot size={16} strokeWidth={2.5} />}
                                            </div>
                                            <div className={cn(
                                                "p-4 md:p-5 rounded-2xl shadow-xl relative overflow-hidden",
                                                isUser
                                                    ? "bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-tr-none border border-white/10"
                                                    : "bg-card/60 backdrop-blur-xl border border-white/5 rounded-tl-none shadow-sm"
                                            )}>
                                                {message.image && (
                                                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                                                        <Image
                                                            src={message.image}
                                                            alt="User upload"
                                                            width={400}
                                                            height={300}
                                                            className="w-full h-auto object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "prose prose-sm md:prose-md max-w-none leading-relaxed font-medium",
                                                    isUser ? "prose-invert text-white" : "prose-invert text-foreground/90 whitespace-pre-wrap break-words"
                                                )}>
                                                    <MathRenderer content={message.content} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-start gap-3"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 border border-primary/10 text-primary flex items-center justify-center">
                                    <LoaderIcon className="h-4 w-4 animate-spin" />
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-card/20 backdrop-blur-md border border-white/5 rounded-2xl w-fit">
                                    {[1, 2, 3].map((dot) => (
                                        <div key={dot} className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Deck */}
            <div className="px-4 md:px-6 py-4 md:py-6 bg-gradient-to-t from-background via-background/95 to-transparent relative z-20">
                <div className="mx-auto w-full max-w-3xl">
                    <form
                        className="relative group transition-all duration-300"
                        onSubmit={handleSubmit}
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-2xl px-3 py-2 shadow-2xl group-focus-within:border-primary/40 transition-all">
                            {/* Attachments Rail */}
                            {(imagePreview || selectedTopicForBadge) && (
                                <div className="flex flex-wrap items-center gap-2 p-2 mb-2 border-b border-border/10">
                                    {imagePreview && (
                                        <Badge
                                            variant="outline"
                                            className="group relative h-12 w-12 overflow-hidden p-0 rounded-lg ring-2 ring-primary/20"
                                        >
                                            <Image alt="Preview" src={imagePreview} fill className="object-cover" />
                                            <button
                                                onClick={handleRemoveFile}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                            >
                                                <IconX size={14} className="text-white" />
                                            </button>
                                        </Badge>
                                    )}
                                    {selectedTopicForBadge && (
                                        <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border-primary/20 flex items-center gap-2">
                                            <IconBook size={12} />
                                            <span className="font-bold text-[10px] md:text-xs truncate max-w-[100px] md:max-w-[150px]">{selectedTopicForBadge.title}</span>
                                            <button onClick={() => setSelectedNoteId(null)}>
                                                <IconX size={12} />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col">
                                <Textarea
                                    className="w-full min-h-[44px] max-h-[160px] resize-none border-none bg-transparent px-3 py-2 text-sm md:text-base font-medium placeholder:text-muted-foreground/40 focus-visible:ring-0 leading-relaxed"
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    value={input}
                                />

                                <div className="flex items-center justify-between pb-1">
                                    <div className="flex items-center">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <IconPaperclip size={18} />
                                            <input className="sr-only" onChange={handleFileChange} ref={fileInputRef} type="file" accept="image/*" />
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                                                    <IconBook size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-64 rounded-2xl p-2 bg-card/95 backdrop-blur-xl border-border/40">
                                                <div className="px-3 py-2 border-b border-border/10 mb-1">
                                                    <p className="font-bold text-[10px] uppercase tracking-widest opacity-40">Context Library</p>
                                                </div>
                                                <div className="max-h-[200px] overflow-y-auto">
                                                    {topics.map((topic) => (
                                                        <DropdownMenuItem
                                                            key={topic.id}
                                                            className="flex items-center justify-between p-2 rounded-xl hover:bg-primary/10 cursor-pointer"
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            <span className="font-bold text-xs truncate flex-1">{topic.title}</span>
                                                            <Switch
                                                                checked={selectedNoteId === topic.id}
                                                                onCheckedChange={(checked) => setSelectedNoteId(checked ? topic.id : null)}
                                                                className="scale-75"
                                                            />
                                                        </DropdownMenuItem>
                                                    ))}
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                                                    <IconAdjustmentsHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-56 rounded-2xl p-3 bg-card/95 backdrop-blur-xl border-border/40 space-y-3">
                                                <div className="px-1 border-b border-border/10 pb-2">
                                                    <p className="font-bold text-[10px] uppercase tracking-widest opacity-40">Assistant Mode</p>
                                                </div>
                                                {[
                                                    { id: 'explainSimple', label: 'Simple Terms' },
                                                    { id: 'includeExamples', label: 'Examples' }
                                                ].map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between">
                                                        <Label className="text-xs font-bold">{item.label}</Label>
                                                        <Switch
                                                            checked={settings[item.id as keyof typeof settings]}
                                                            onCheckedChange={(value) => updateSetting(item.id as keyof typeof settings, value)}
                                                            className="scale-75"
                                                        />
                                                    </div>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <Button
                                        className="h-9 md:h-10 px-4 md:px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs md:text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
                                        disabled={(!input.trim() && !imageData) || isTyping}
                                        type="submit"
                                    >
                                        {isTyping ? <LoaderIcon className="h-4 w-4 animate-spin" /> : (
                                            <>
                                                <span className="hidden md:inline">Ask AI</span>
                                                <IconArrowUp className="md:ml-2" size={16} strokeWidth={3} />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
