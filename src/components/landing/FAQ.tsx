'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronDown, MessageCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "How does the AI persona system work?",
        answer: "Our persona system adjusts the simplified logic, terminology, and analogies used in your notes. Whether you want a subject explained like a five-year-old or a senior engineer, the AI restructures the fundamental concepts to match your cognitive baseline."
    },
    {
        question: "Can I upload my own research papers?",
        answer: "Yes. Wisdom Pro allows you to upload PDFs, textbooks, and URLs. The engine performs a full-depth scan, mapping out the internal logic of the document to create ultra-detailed notes and quizzes."
    },
    {
        question: "Is there a limit on how many notes I can generate?",
        answer: "Free accounts can generate up to 3 topics. Sage Pro and Lifetime tiers have unlimited generation capabilities, allowing you to map entire academic terms or professional sectors."
    },
    {
        question: "Is my data secure?",
        answer: "We use enterprise-grade encryption for all document uploads and study data. Your personal study material is never shared or used to train public models without your explicit permission."
    }
];

const FAQItem = ({ question, answer, index }: { question: string, answer: string, index: number }) => {
    const [isOpen, setIsOpen] = useState(index === 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-white/5 last:border-0"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 flex items-center justify-between text-left group"
            >
                <span className={cn(
                    "text-xl font-headline font-black transition-colors",
                    isOpen ? "text-primary" : "text-white group-hover:text-zinc-300"
                )}>
                    {question}
                </span>
                <div className={cn(
                    "h-10 w-10 rounded-xl border flex items-center justify-center transition-all",
                    isOpen ? "bg-primary border-primary text-white rotate-180" : "bg-zinc-900 border-white/5 text-zinc-600 group-hover:border-white/20"
                )}>
                    <ChevronDown className="h-5 w-5" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-zinc-500 font-medium leading-relaxed max-w-2xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export function FAQ() {
    return (
        <section id="faq" className="py-32 bg-[#0A0A0B] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left: Headline */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-40 space-y-8">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="h-px w-8 bg-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Inquiry Base</span>
                                </motion.div>
                                <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white leading-none">
                                    Common <br />
                                    <span className="text-zinc-600">Queries.</span>
                                </h2>
                                <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">
                                    Everything you need to know about the Wisdom Learning Infrastructure.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black">Still have questions?</p>
                                        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Connect with Support</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Accordion */}
                    <div className="lg:col-span-7">
                        <div className="border-t border-white/5">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} {...faq} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
