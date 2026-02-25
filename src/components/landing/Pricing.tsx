'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Gem, Clock, Camera, Target, Brain, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const targetDate = new Date('2026-03-15T00:00:00');
        const now = new Date();
        const difference = +targetDate - +now;

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    const parts = [
        { val: timeLeft.days, label: 'DAYS' },
        { val: timeLeft.hours, label: 'HRS' },
        { val: timeLeft.minutes, label: 'MINS' },
        { val: timeLeft.seconds, label: 'SECS' },
    ];

    return (
        <div className="flex gap-3">
            {parts.map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <div className="bg-[#121214] w-12 h-14 rounded-lg flex items-center justify-center border border-white/5 shadow-2xl">
                        <span className="text-xl font-bold text-white font-mono">
                            {String(p.val).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{p.label}</span>
                </div>
            ))}
        </div>
    );
};

export function Pricing() {
    return (
        <section id="pricing" className="py-32 bg-[#0A0A0B] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Top Section: Header + 2 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12 items-stretch">
                    {/* Header Block */}
                    <div className="flex flex-col justify-start pt-4">
                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Pricing</h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            No hidden fees, just transparent pricing for your academic success.
                        </p>

                        <div className="w-full h-px bg-white/10 mb-8" />

                        <h3 className="text-white font-bold mb-4">This isn't just a tool</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            We maintain quality by focusing on features that genuinely enhance learning and save you time.
                        </p>
                    </div>

                    {/* Pricing Cards Grid (2/3) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {/* Scholar Card */}
                        <Card className="bg-[#0D0D0E] border-white/5 p-8 rounded-[2rem] flex flex-col h-full hover:border-white/10 transition-all group">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Scholar</h3>
                                <p className="text-zinc-500 text-sm italic">For trying out the core features.</p>
                            </div>

                            <div className="mb-10">
                                <span className="text-5xl font-bold text-white">$0</span>
                            </div>

                            <ul className="space-y-4 mb-12 flex-1">
                                {[
                                    "3 Topic Generations",
                                    "1 Study Roadmap Generation",
                                    "3 Pomodoro Sessions",
                                    "3 Uses of the Capture Tool"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-400 text-xs font-medium">
                                        <Check className="w-4 h-4 text-white" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full h-14 bg-transparent border border-white/5 rounded-xl text-zinc-200 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] py-4 transition-all">
                                Get Started for Free
                            </Button>
                        </Card>

                        {/* Sage Card (Featured) */}
                        <Card className="bg-white p-8 rounded-[2.5rem] flex flex-col h-full transform scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group border-none">
                            <div className="absolute top-6 right-6">
                                <div className="bg-[#C83434] px-4 py-1.5 rounded-full flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-white fill-current" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Best Value</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-black mb-2">Sage</h3>
                                <p className="text-zinc-500 text-sm italic">For dedicated students and professionals.</p>
                            </div>

                            <div className="mb-10 flex flex-col">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-black">$8.25</span>
                                    <span className="text-zinc-500 font-bold ml-1">/ month</span>
                                </div>
                                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Billed annually at $99</span>
                            </div>

                            <ul className="space-y-4 mb-12 flex-1">
                                {[
                                    "Unlimited Topic Generations",
                                    "Unlimited Study Roadmaps",
                                    "Unlimited Pomodoro Sessions",
                                    "Unlimited Capture Tool Usage",
                                    "Unlimited WisdomGPT AI",
                                    "Priority Email Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-600 text-xs font-bold leading-none">
                                        <Check className="w-4 h-4 text-[#C83434]" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full h-14 bg-black rounded-xl text-white hover:bg-zinc-900 font-bold uppercase tracking-widest text-[10px] py-4 transition-all flex items-center justify-center gap-2">
                                <Gem className="w-4 h-4" />
                                Go Pro
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Bottom Section: Lifetime Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                    {/* Gradient Background + Grid Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C83434] via-[#7B2E76] to-[#3B66F0] transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                    <div className="relative z-10 p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Offer Content */}
                        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 border border-white/10 w-fit mx-auto lg:mx-0">
                                <Clock className="w-3 h-3 text-white" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Limited Time Offer</span>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold text-white tracking-tight">Lifetime Sage</h2>
                                <p className="text-white/80 text-lg max-w-sm leading-relaxed font-medium">
                                    Unlimited access, forever. One payment, endless learning.
                                </p>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="flex-shrink-0">
                            <CountdownTimer />
                        </div>

                        {/* Price & CTA */}
                        <div className="flex flex-col items-center lg:items-end gap-6 min-w-[200px]">
                            <div className="text-right">
                                <div className="flex items-center justify-center lg:justify-end gap-3 text-white">
                                    <span className="text-2xl font-bold opacity-40 line-through">$999</span>
                                    <span className="text-4xl font-black">$299</span>
                                </div>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">One-time payment</p>
                            </div>
                            <Button className="h-14 bg-white text-black hover:bg-zinc-100 rounded-xl px-10 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-white/10 transition-all">
                                Get Lifetime Access
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @font-face {
                    font-family: 'Inter';
                    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                }
            `}</style>
        </section>
    );
}

