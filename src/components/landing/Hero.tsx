'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Brain, Zap, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header as HeroHeader } from './Header';

export function Hero() {
    return (
        <>
            <HeroHeader />
            <main className="relative min-h-screen pt-20 overflow-hidden bg-[#050505]">
                {/* Background Refinement */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_-20%,_rgba(220,38,38,0.12)_0%,_transparent_60%)]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>

                <section className="relative z-10 container mx-auto px-6 pt-24 pb-32">
                    <div className="max-w-5xl mx-auto flex flex-col items-center">

                        {/* Status chip */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8"
                        >
                            <div className="flex -space-x-1">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-500" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                                Join 4.2k+ Scholars this week
                            </span>
                            <ChevronRight className="w-3 h-3 text-zinc-600" />
                        </motion.div>

                        {/* Redesigned Headline (Smaller, Modern) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white mb-6 leading-[1.1]">
                                Modern Intelligence for the <br />
                                <span className="bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">Boundless Learner.</span>
                            </h1>

                            <p className="max-w-xl mx-auto text-zinc-400 text-base md:text-lg font-medium leading-relaxed mb-10">
                                Wisdom is a high-performance workspace that turns complex archives
                                into beautiful, interactive study modules instantly.
                            </p>
                        </motion.div>

                        {/* CTA Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
                        >
                            <Button asChild size="lg" className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-white/5 group">
                                <Link href="/signup" className="flex items-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.05] font-bold text-sm uppercase tracking-widest transition-all">
                                <Link href="#demo">Watch System Tour</Link>
                            </Button>
                        </motion.div>

                        {/* Image Preview Container (Elevated Modern) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="relative w-full max-w-5xl"
                        >
                            {/* Inner Glow */}
                            <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-20 pointer-events-none" />

                            <div className="relative p-1.5 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                                <div className="bg-[#0D0D0E] rounded-[2.2rem] overflow-hidden border border-white/5 shadow-inner">
                                    {/* Minimalist Browser Header */}
                                    <div className="h-10 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                        </div>
                                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">wisdomis.fun</div>
                                        <div className="w-8" />
                                    </div>

                                    <div className="relative group">
                                        <Image
                                            src="/hero.png"
                                            alt="Wisdom Dashboard"
                                            width={2400}
                                            height={1350}
                                            className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                            priority
                                        />

                                        {/* Floating Utility Cards (Very Mini) */}
                                        <div className="absolute top-10 right-10 flex flex-col gap-3">
                                            {[
                                                { icon: Brain, label: "Neural Mapping", color: "text-blue-400" },
                                                { icon: Zap, label: "Instant Sync", color: "text-amber-400" },
                                                { icon: Shield, label: "Secure Vault", color: "text-zinc-400" }
                                            ].map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.8 + (i * 0.1) }}
                                                    className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-2.5 shadow-2xl"
                                                >
                                                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">{item.label}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Bottom Progress Bar Simulation */}
                                        <div className="absolute bottom-4 left-6 right-6 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "35%" }}
                                                transition={{ duration: 2, delay: 1 }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Accent Glows */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                        </motion.div>

                    </div>
                </section>
            </main>
        </>
    );
}
