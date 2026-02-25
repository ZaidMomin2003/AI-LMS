'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Microscope, Briefcase, Code, PenTool, Globe, ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const useCases = [
    {
        title: "Academic Excellence",
        description: "Transform 60-minute lectures into 5-minute interactive mastery sessions. Perfect for Med, Law, and Engineering students facing heavy curricula.",
        icon: <GraduationCap className="w-8 h-8" />,
        color: "bg-primary",
        tags: ["Lecture Summaries", "Adaptive Quizzes"]
    },
    {
        title: "Deep Research",
        description: "Upload dense primary source documents and research papers. Wisdom extracts the logic while preserving the context for accurate summaries.",
        icon: <Microscope className="w-8 h-8" />,
        color: "bg-blue-600",
        tags: ["Paper Analysis", "Contextual Extraction"]
    },
    {
        title: "Professional Edge",
        description: "Onboard into new industries or complex projects with speed. Master the terminology and roadmap of any professional field instantly.",
        icon: <Briefcase className="w-8 h-8" />,
        color: "bg-emerald-600",
        tags: ["Sector Onboarding", "Field Glossaries"]
    }
];

export function UseCases() {
    return (
        <section id="use-cases" className="py-32 bg-[#0A0A0B] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <div className="h-px w-8 bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Applications</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white leading-none">
                            Engineered for <br />
                            <span className="text-zinc-600">Complex Scenarios.</span>
                        </h2>
                    </div>
                    <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-sm">
                        Wisdom isn't just for general knowledge—it's optimized for the hardest structural learning tasks across industries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {useCases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#121214] border border-white/5 rounded-[3rem] p-10 flex flex-col h-full group hover:border-white/10 transition-all"
                        >
                            <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-10 shadow-lg transition-transform group-hover:scale-110", useCase.color)}>
                                {useCase.icon}
                            </div>

                            <h3 className="text-2xl font-headline font-black text-white mb-4 flex items-center justify-between">
                                {useCase.title}
                                <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-primary transition-colors" />
                            </h3>

                            <p className="text-zinc-500 font-medium leading-relaxed mb-8 flex-1">
                                {useCase.description}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                                {useCase.tags.map((tag, j) => (
                                    <span key={j} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-3 py-1.5 bg-zinc-900 rounded-full border border-white/5 group-hover:text-zinc-400 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
