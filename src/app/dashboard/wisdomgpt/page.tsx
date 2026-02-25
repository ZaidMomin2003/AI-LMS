
'use client';

import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck, Gem, Lock } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function WisdomGptPage() {
    const { canUseFeature } = useSubscription();

    return (
        <div className="flex flex-col h-screen bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/10 bg-background/40 backdrop-blur-xl px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                        <BookOpenCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black font-headline text-xl tracking-tighter leading-none">Wisdom<span className="text-primary italic">GPT</span></span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">AI Study Assistant</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="rounded-xl border border-transparent hover:border-border/40 hover:bg-background/40 transition-all px-3">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="font-bold tracking-tight text-sm">Dashboard</span>
                        </Link>
                    </Button>
                </div>
            </header>

            {!canUseFeature('wisdomGpt') ? (
                <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="max-w-md w-full text-center mx-auto border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden p-8">
                            <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-2xl w-fit mb-4">
                                <Lock className="w-8 h-8" />
                            </div>
                            <CardTitle className="font-headline text-2xl font-black tracking-tighter">Wisdom Locked</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium px-4 mt-2">Access to the Neural Synthesis Engine requires an active Pro subscription.</CardDescription>
                            <Button asChild size="lg" className="mt-8 rounded-full px-10 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                                <Link href="/dashboard/pricing">
                                    <Gem className="mr-2 h-4 w-4" />
                                    Forge Upgrade
                                </Link>
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                <div className="flex-1 min-h-0 relative z-10">
                    <WisdomGptChat />
                </div>
            )}
        </div>
    )
}
