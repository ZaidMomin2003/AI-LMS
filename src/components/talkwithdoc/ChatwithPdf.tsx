
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface ChatWithPdfProps {
    pdfFile: File;
}

export function ChatWithPdf({ pdfFile }: ChatWithPdfProps) {
    return (
        <div className="h-full flex flex-col p-4">
            <CardHeader className="p-2 text-center">
                <CardTitle className="font-headline text-xl">Chat with "{pdfFile.name}"</CardTitle>
                <CardDescription>Ask questions about the document.</CardDescription>
            </CardHeader>
            <div className="flex-1 bg-muted/50 rounded-lg my-4 flex items-center justify-center">
                <p className="text-muted-foreground">Chat UI will be here</p>
            </div>
            {/* Input area will go here */}
        </div>
    );
}
