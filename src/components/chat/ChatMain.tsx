
'use client';

import { Send, Bot, History, BookOpen, ListTodo, Lock, Star, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DashboardStats } from '../dashboard/DashboardStats';
import { TopicForm } from '../dashboard/TopicForm';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useTopic } from '@/context/TopicContext';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { TodayStudyTask } from '../dashboard/TodayStudyTask';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';


export function ChatMain() {
    const { user } = useAuth();
    const { topics } = useTopic();
    const [historySearchTerm, setHistorySearchTerm] = useState('');

    const filteredTopics = useMemo(() => {
        if (!historySearchTerm) return topics;
        return topics.filter(topic =>
            (topic.title && topic.title.toLowerCase().includes(historySearchTerm.toLowerCase())) ||
            (topic.subject && topic.subject.toLowerCase().includes(historySearchTerm.toLowerCase()))
        );
    }, [topics, historySearchTerm]);

    return (
        <div className="h-full flex flex-col bg-background/50 border-0 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-primary/5">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-purple-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Top-right: History Button and Dialog */}
            <div className="absolute top-6 right-6 z-20">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent transition-all duration-300">
                            <History className="h-5 w-5 text-muted-foreground" />
                            <span className="sr-only">View History</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] border-border/50 backdrop-blur-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-2xl font-bold">Recent Learning</DialogTitle>
                            <DialogDescription className="text-muted-foreground/80">
                                Continue where you left off with your study sessions.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <Input
                                placeholder="Search topics or subjects..."
                                className="h-11 pl-10 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/20"
                                value={historySearchTerm}
                                onChange={(e) => setHistorySearchTerm(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-[350px] pr-4 mt-4">
                            {filteredTopics.length > 0 ? (
                                <div className="space-y-3 pb-4">
                                    {filteredTopics.map((topic) => (
                                        <Link
                                            key={topic.id}
                                            href={`/topic/${topic.id}`}
                                            className="group flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all duration-200"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{topic.title}</p>
                                                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-bold text-muted-foreground/70">{topic.subject}</Badge>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground/60 font-medium">
                                                    Last studied {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="h-4 w-4 text-primary" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center opacity-50">
                                    <History className="w-12 h-12 mb-3 text-muted-foreground" />
                                    <p className="text-sm font-medium">
                                        {topics.length > 0 ? `No matches for "${historySearchTerm}"` : 'Your learning journey starts here.'}
                                    </p>
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundSize: '3rem 3rem' }}
            />

            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10 pt-10">
                {/* AI Orb Visualization */}
                <div className="relative mb-10">
                    {/* Layered Glows */}
                    <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 animate-pulse" />
                    <div className="absolute inset-0 bg-purple-500 blur-[80px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

                    {/* Floating Ring */}
                    <div className="absolute -inset-4 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
                    <div className="absolute -inset-8 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30" />

                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-40 h-40"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 p-[2px] shadow-2xl shadow-primary/40">
                            <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden ring-4 ring-background">
                                <Image
                                    src="/chatbot.jpg"
                                    alt="Wisdom AI"
                                    width={160}
                                    height={160}
                                    className="object-cover scale-110"
                                />
                            </div>
                        </div>
                        {/* Active Status Badge */}
                        <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                        </div>
                    </motion.div>
                </div>

                <h1 className="text-5xl font-extrabold font-headline tracking-tight text-foreground sm:text-6xl">
                    Ready to <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">Grow?</span>
                </h1>
                <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-lg font-medium opacity-80 leading-relaxed">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'Scholar'}. I'm here to help you master any subject with the power of AI.
                </p>
            </div>

            {/* Bottom Section: Glass Container for Stats & Form */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-10 mt-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                    {/* Left: Stats & Goal */}
                    <div className="lg:col-span-1 space-y-4">
                        <TodayStudyTask />
                    </div>

                    {/* Middle: Chat Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 p-4 rounded-[2.5rem] shadow-2xl shadow-black/20">
                            <TopicForm variant="chat" />
                        </div>
                    </div>

                    {/* Right: Insights/Stats Summary */}
                    <div className="lg:col-span-1">
                        <DashboardStats />
                    </div>
                </div>
            </div>
        </div>
    );
}
