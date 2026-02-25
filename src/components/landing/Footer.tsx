'use client';

import React from 'react';
import { BookOpenCheck, Github, Twitter, Linkedin, Heart, ExternalLink, Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0A0A0B] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <BookOpenCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-headline font-black text-xl tracking-tighter text-white leading-none">WISDOM</h2>
                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Mastery AI</p>
                            </div>
                        </Link>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
                            Architecting the future of structural learning. Deploying advanced AI to deconstruct knowledge for global scholars.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary transition-all">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Product</h4>
                            <ul className="space-y-4">
                                {['Features', 'Pricing', 'Roadmap', 'API'].map(item => (
                                    <li key={item}><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Company</h4>
                            <ul className="space-y-4">
                                {['About', 'Stories', 'Careers', 'Contact'].map(item => (
                                    <li key={item}><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Legal</h4>
                            <ul className="space-y-4">
                                {['Privacy', 'Terms', 'Cookie Policy', 'Security'].map(item => (
                                    <li key={item}><Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Status</h4>
                            <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">All Systems Live</span>
                                </div>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest italic">Global Node: AWS-West-2</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-medium text-zinc-600 flex items-center gap-2">
                        © {currentYear} Wisdom AI Learning Platforms. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 flex items-center gap-2">
                            Built with <Heart className="w-3 h-3 text-primary fill-current" /> by Zenith Labs
                        </p>
                        <div className="h-4 w-px bg-zinc-800" />
                        <div className="flex items-center gap-2 text-zinc-700">
                            <Shield className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
