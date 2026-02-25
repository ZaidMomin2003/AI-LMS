'use client';

import { AppLayout } from '@/components/AppLayout';
import { AddExamForm } from '@/components/exam/AddExamForm';
import { motion } from 'framer-motion';

export default function ExamPage() {
    return (
        <AppLayout>
            <div className="flex-1 relative overflow-hidden bg-background">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

                <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-12 min-h-[calc(100vh-64px)]">
                    <div className="w-full max-w-xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-4"
                        >
                            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter leading-tight">
                                Establish Your <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Exam Target</span>
                            </h2>
                            <p className="text-muted-foreground text-lg font-medium opacity-70 max-w-md mx-auto">
                                Define your next milestone and let the automated countdown focus your discipline.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <AddExamForm />
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
