'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote, ChevronRight, Globe, Users, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
    {
        name: "Alex Thompson",
        role: "Senior Medical Student",
        content: "The ability to turn 500-page textbooks into interactive flashcards saved my ophthalmology finals. It's not just an AI, it's a second brain that works while I sleep.",
        avatar: "AT",
        stats: "98th percentile rank",
        verified: true
    },
    {
        name: "Dr. Sarah Chen",
        role: "AI Ethics Researcher",
        content: "Wisdom manages to capture the nuance of academic papers without losing the signal in the noise. The most sophisticated educational tool I've seen yet.",
        avatar: "SC",
        stats: "320+ Papers Digested",
        verified: true
    },
    {
        name: "Marcus Aurelius",
        role: "Product Designer @ Veris",
        content: "Design systems can get messy. I used Wisdom to build a custom study guide for my team's onboarding, and it cut the learning curve by half.",
        avatar: "MA",
        stats: "Saved 40+ hours",
        verified: true
    }
];

const StatBlock = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-zinc-900/40 border border-white/5 shadow-2xl">
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-3xl font-headline font-black text-white">{value}</span>
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-600">{label}</span>
    </div>
);

export function Testimonials() {
    return (
        <section id="stories" className="py-32 relative bg-[#0A0A0B] overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Left Side: Text & Stats */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2"
                            >
                                <div className="h-px w-8 bg-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Success Stories</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white leading-none">
                                Elite Minds, <br />
                                <span className="text-zinc-600">Wisdom Powered.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">
                                Joins thousands of students, researchers, and professionals who have upgraded their cognitive output.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <StatBlock label="Active Users" value="12,402" icon={Users} />
                            <StatBlock label="Countries" value="84" icon={Globe} />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 relative group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Trophy className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="text-white font-black text-lg">Top Rated Learning Tool</p>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Education App of the Year '25</p>
                                </div>
                            </div>
                            <div className="flex text-primary">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Masonry-style Testimonials */}
                    <div className="lg:col-span-7 space-y-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className={cn(
                                    "p-8 md:p-10 rounded-[3rem] bg-[#121214] border border-white/5 relative overflow-hidden group",
                                    i === 1 ? "md:ml-12" : ""
                                )}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Quote className="w-20 h-20 text-white" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full gap-8">
                                    <p className="text-xl md:text-2xl font-medium text-white leading-relaxed font-sans italic">
                                        "{t.content}"
                                    </p>

                                    <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-8">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-14 w-14 rounded-2xl border-2 border-zinc-800">
                                                <AvatarFallback className="bg-zinc-900 text-white font-black">{t.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-lg font-headline font-black text-white">{t.name}</p>
                                                    {t.verified && <ShieldCheck className="w-4 h-4 text-primary" />}
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t.role}</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block text-right">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Impact</p>
                                            <p className="text-primary font-black text-sm">{t.stats}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
