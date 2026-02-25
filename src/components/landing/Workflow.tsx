'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Send, Sparkles, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    {
        title: "Identify Input",
        description: "Paste a URL, upload a PDF, or simply type a curiosity. Our engine accepts any data source as the root of wisdom.",
        icon: <Send className="w-5 h-5" />,
    },
    {
        title: "Source Upload",
        description: "The AI instantly scans the structural depth of the content, identifying core concepts and sub-logical hierarchies.",
        icon: <Layers className="w-5 h-5" />,
    },
    {
        title: "AI Processing",
        description: "Notes are generated using your selected persona, while flashcards and quizzes are built to target the deconstructed logic.",
        icon: <Sparkles className="w-5 h-5" />,
    },
    {
        title: "Sage Mastery",
        description: "Step through your custom roadmap. Use interactive tools to solidify your knowledge until true mastery is achieved.",
        icon: <BookOpen className="w-5 h-5" />,
    }
];

export function Workflow() {
    return (
        <section id="workflow" className="py-32 bg-[#0A0A0B] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-6"
                    >
                        <div className="h-px w-8 bg-zinc-800" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Operation Cycle</span>
                        <div className="h-px w-8 bg-zinc-800" />
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white mb-6 leading-none">
                        Four Phases to <br />
                        <span className="text-primary italic">Absolute Intelligence.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="h-20 w-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all mb-8 relative z-10">
                                {step.icon}
                                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-lg bg-zinc-800 border border-white/5 text-[10px] font-black text-white flex items-center justify-center">
                                    0{i + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-headline font-black text-white mb-4 uppercase tracking-tighter">{step.title}</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
