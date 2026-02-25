
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowUp, BookText, FileText, Lightbulb, RefreshCcw } from 'lucide-react';

interface ChatWithPdfProps {
    pdfFile: File;
}

const PromptSuggestion = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <Card className="hover:bg-muted cursor-pointer transition-colors">
        <CardContent className="p-4">
            <div className="text-muted-foreground mb-4">{icon}</div>
            <p className="text-sm font-medium">{text}</p>
        </CardContent>
    </Card>
);

export function ChatWithPdf({ pdfFile }: ChatWithPdfProps) {
    const [input, setInput] = useState('');

    return (
        <div className="h-full flex flex-col p-4 md:p-6 bg-muted/30">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-headline font-bold">Chat with Document</h2>
                <p className="text-muted-foreground truncate">"{pdfFile.name}"</p>
            </div>

            {/* Chat Messages Area (will be populated later) */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                {/* Initial State with Suggestions */}
                <div className="w-full max-w-3xl">
                    <p className="text-muted-foreground text-center mb-4">Use one of the prompts below or ask your own question to begin.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        <PromptSuggestion icon={<BookText size={20} />} text="Summarize this document for me in three paragraphs." />
                        <PromptSuggestion icon={<Lightbulb size={20} />} text="What are the 3 key takeaways from this document?" />
                        <PromptSuggestion icon={<FileText size={20} />} text="Generate a list of potential quiz questions based on the content." />
                        <PromptSuggestion icon={<RefreshCcw size={20} />} text="Explain the main topic here as if I am a complete beginner." />
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="mt-auto w-full max-w-3xl mx-auto">
                <div className="relative rounded-xl border bg-background shadow-lg p-2">
                    <div className="flex items-center">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about the document..."
                            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button type="submit" size="icon" disabled={!input.trim()} className="rounded-lg w-9 h-9">
                            <ArrowUp className="h-5 w-5" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                    <div className="flex items-center justify-end text-xs text-muted-foreground pt-1 pr-2">
                        <span>{input.length} / 2000</span>
                    </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    AI may produce inaccurate information about your document.
                </p>
            </div>
        </div>
    );
}
