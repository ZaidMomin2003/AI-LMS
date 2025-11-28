
'use client';

import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';

export default function WisdomGptPage() {
    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                        <BookOpenCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                        <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                    </div>
                </div>
                <Button asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
            </header>
            {/* The children (page content) will fill the remaining space */}
            <div className="flex-1 min-h-0">
                <WisdomGptChat />
            </div>
        </div>
    )
}
