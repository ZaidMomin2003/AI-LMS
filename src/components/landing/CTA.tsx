'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Zap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CTA() {
    return (
        <section id="cta" className="py-20 relative bg-[#0A0A0B] overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative p-12 md:p-24 rounded-[4rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl"
                >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-primary/10 border border-primary/20 px-6 py-2 rounded-full mb-8"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Terminal Readiness</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-7xl font-headline font-black tracking-tight text-white mb-8 leading-[0.9] max-w-4xl">
                            The Era of Memory <br />
                            <span className="text-zinc-600">Is Over.</span>
                        </h2>

                        <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12">
                            Stop wasting hours on passive reading. Deploy our learning engine and achieve subject mastery in a fraction of the time.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 group">
                                <Link href="/signup" className="flex items-center gap-2">
                                    Get Started for Free
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">No CC Required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Instant Access</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Accent */}
                        <div className="mt-20 pt-10 border-t border-white/5 w-full max-w-lg flex items-center justify-between gap-8 opacity-40">
                            <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all cursor-default">
                                <Rocket className="w-5 h-5 text-white" />
                                <span className="font-headline font-black text-white text-lg tracking-tighter">FastScale</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all cursor-default">
                                <Sparkles className="w-5 h-5 text-white" />
                                <span className="font-headline font-black text-white text-lg tracking-tighter">AI Lab</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all cursor-default">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                                <span className="font-headline font-black text-white text-lg tracking-tighter">Verified</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
