
'use client';

import { ChatWithPdf } from '@/components/talkwithdoc/ChatwithPdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function TalkWithDocPage() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
            setPdfFile(file);
        } else {
            // Handle error: not a PDF or too large
            alert('Please upload a PDF file smaller than 5MB.');
        }
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
            setPdfFile(file);
        } else {
            alert('Please upload a PDF file smaller than 5MB.');
        }
    };
    
    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center justify-between p-4 border-b">
                 <h1 className="text-xl font-headline font-bold">Talk with Doc</h1>
                 <Button asChild variant="outline">
                    <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                 </Button>
            </header>
            
            <main className="flex-1 flex flex-col overflow-hidden">
                {pdfFile ? (
                     <div className="flex h-full">
                        {/* PDF Viewer (60%) */}
                        <div className="w-3/5 h-full border-r">
                            {/* PDF will be rendered here */}
                            <div className="flex items-center justify-center h-full bg-muted">
                                <p>PDF Viewer Area</p>
                            </div>
                        </div>
                        {/* Chat Area (40%) */}
                        <div className="w-2/5 h-full">
                            <ChatWithPdf pdfFile={pdfFile} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center p-4 md:p-8">
                        <Card 
                            className="w-full max-w-2xl text-center"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                        >
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                                    <UploadCloud className="w-10 h-10" />
                                </div>
                                <CardTitle className="font-headline pt-4 text-3xl">Upload Your Document</CardTitle>
                                <CardDescription>
                                    Drag & drop your PDF here, or click to select a file.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12">
                                    <input
                                        type="file"
                                        id="pdf-upload"
                                        className="hidden"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer space-y-2">
                                        <p className="text-muted-foreground">Max file size: 5MB</p>
                                        <div className="inline-block bg-primary text-primary-foreground rounded-md px-4 py-2 font-semibold">
                                            Browse Files
                                        </div>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
