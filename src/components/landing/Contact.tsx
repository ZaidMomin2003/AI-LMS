'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function Contact() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            toast({
                title: "Signal Received",
                description: "A Wisdom representative will contact you shortly.",
            });
        }, 1500);
    };

    return (
        <section id="contact" className="py-32 relative bg-[#0A0A0B]">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-7xl mx-auto">

                    {/* Left Side: Info */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2"
                            >
                                <div className="h-px w-8 bg-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Inquiries</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white leading-none">
                                Let's <br />
                                <span className="text-zinc-600">Sync.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">
                                Have a specific institutional request or a feature suggestion? Our team is standing by.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: <Mail className="w-5 h-5 text-primary" />, label: 'Email', value: 'hello@wisdom.ai' },
                                { icon: <MapPin className="w-5 h-5 text-primary" />, label: 'Base', value: 'Silicon Valley, CA' },
                                { icon: <Sparkles className="w-5 h-5 text-primary" />, label: 'Backend', value: 'AWS Cloud Infrastructure' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-primary transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{item.label}</p>
                                        <p className="text-white font-bold text-lg">{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-7">
                        <Card className="bg-zinc-900/30 border-zinc-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            {/* Background Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center text-center py-20 space-y-6"
                                >
                                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-headline font-black text-white">Message Sent</h3>
                                    <p className="text-zinc-500 font-medium">Thank you for reaching out. We've received your inquiry.</p>
                                    <Button variant="outline" className="h-12 border-zinc-800 rounded-xl" onClick={() => setSubmitted(false)}>Send another message</Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Full Name</Label>
                                            <Input required placeholder="Alan Turing" className="h-14 bg-zinc-950/50 border-zinc-800 rounded-2xl focus:border-primary transition-all text-white placeholder:text-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Email Address</Label>
                                            <Input required type="email" placeholder="alan@enigma.com" className="h-14 bg-zinc-950/50 border-zinc-800 rounded-2xl focus:border-primary transition-all text-white placeholder:text-zinc-800" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Subject</Label>
                                        <Input required placeholder="Institutional Partnership" className="h-14 bg-zinc-950/50 border-zinc-800 rounded-2xl focus:border-primary transition-all text-white placeholder:text-zinc-800" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Message</Label>
                                        <Textarea required placeholder="How can Wisdom help you?" className="min-h-[150px] bg-zinc-950/50 border-zinc-800 rounded-2xl focus:border-primary transition-all text-white placeholder:text-zinc-800 p-4" />
                                    </div>

                                    <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20">
                                        {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                            <span className="flex items-center gap-2">
                                                Transmit Message
                                                <Send className="h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
