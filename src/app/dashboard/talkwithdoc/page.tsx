
'use client';

import { ChatWithPdf } from '@/components/talkwithdoc/ChatwithPdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, UploadCloud, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useToast } from '@/hooks/use-toast';

export default function TalkWithDocPage() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const { toast } = useToast();

    useEffect(() => {
        // Set up the worker when the component mounts on the client
        pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

        return () => {
            // Revoke the object URL when the component unmounts
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);
    
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
            setPdfFile(file);
            setFileUrl(URL.createObjectURL(file));
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid File',
                description: 'Please upload a PDF file smaller than 5MB.',
            });
        }
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
            setPdfFile(file);
            setFileUrl(URL.createObjectURL(file));
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid File',
                description: 'Please upload a PDF file smaller than 5MB.',
            });
        }
    };

    const goToPrevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    const goToNextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
    
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
                {pdfFile && fileUrl ? (
                     <div className="flex h-full">
                        {/* PDF Viewer (60%) */}
                        <div className="w-3/5 h-full border-r bg-muted flex flex-col items-center justify-center relative overflow-hidden">
                           <div className="flex-1 w-full overflow-auto flex items-center justify-center">
                                <Document
                                    file={fileUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> <p>Loading PDF...</p></div>}
                                    error={<p className="text-destructive">Failed to load PDF file.</p>}
                                >
                                    <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} />
                                </Document>
                           </div>
                           {numPages && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 border rounded-full p-1.5 shadow-lg backdrop-blur-sm">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium">
                                        {pageNumber} / {numPages}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <div className="w-px h-5 bg-border mx-1"></div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setScale(s => s + 0.1)}>
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                </div>
                           )}
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
