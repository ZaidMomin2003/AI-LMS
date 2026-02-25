
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Image as ImageIcon, Upload, Loader2, Sparkles, AlertTriangle, Gem, Lock, SwitchCamera } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { captureAnswerAction } from './actions';
import type { CaptureTheAnswerOutput } from '@/ai/flows/capture-the-answer-flow';
import { Separator } from '@/components/ui/separator';
import { MathRenderer } from '@/components/MathRenderer';
import { useProfile } from '@/context/ProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function CapturePage() {
    const [mode, setMode] = useState<'idle' | 'capture' | 'preview'>('idle');
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CaptureTheAnswerOutput | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { updateProfile } = useProfile();
    const { canUseFeature } = useSubscription();
    const isMobile = useIsMobile();

    const canUseCapture = canUseFeature('capture');

    useEffect(() => {
        let stream: MediaStream | null = null;
        const getCameraPermission = async () => {
            if (mode === 'capture' && videoRef.current) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setHasCameraPermission(true);
                } catch (err) {
                    console.error('Error accessing camera:', err);
                    setHasCameraPermission(false);
                }
            }
        };
        getCameraPermission();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mode, facingMode]);

    const startCamera = () => {
        if (!canUseCapture) {
            showUpgradeToast();
            return;
        }
        setMode('capture');
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!canUseCapture) {
            showUpgradeToast();
            return;
        }
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result as string);
                setMode('preview');
            };
            reader.readAsDataURL(file);
        }
    };

    const takePicture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImageData(dataUrl);
            setMode('preview');

            // Stop the camera stream after taking a picture
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const showUpgradeToast = () => {
        toast({
            variant: "destructive",
            title: "Free Limit Reached",
            description: "Please upgrade to use the Capture feature again.",
        });
    };

    const handleGetAnswer = async () => {
        if (!imageData) return;
        setIsLoading(true);
        setResult(null);
        try {
            const response = await captureAnswerAction({ imageDataUri: imageData });
            setResult(response);
            // Increment capture count
            await updateProfile({ captureCount: -1 }); // Using -1 as a sentinel for increment
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: error.message || 'Could not get an answer from the AI.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setMode('idle');
        setImageData(null);
        setResult(null);
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    const renderContent = () => {
        if (!canUseCapture && mode === 'idle') {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="max-w-md w-full text-center mx-auto border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden p-8">
                        <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-2xl w-fit mb-4">
                            <Lock className="w-8 h-8" />
                        </div>
                        <CardTitle className="font-headline text-2xl font-black">Vision Locked</CardTitle>
                        <CardDescription className="text-muted-foreground font-medium px-4 mt-2">Your free vision processing is depleted. Upgrade to access full AI ocular synthesis.</CardDescription>
                        <Button asChild size="lg" className="mt-8 rounded-full px-10 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                            <Link href="/dashboard/pricing">
                                <Gem className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </Link>
                        </Button>
                    </Card>
                </motion.div>
            );
        }

        switch (mode) {
            case 'idle':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Card onClick={startCamera} className="cursor-pointer group relative overflow-hidden h-64 border-border/40 bg-card/40 backdrop-blur-xl hover:border-primary/40 transition-all flex flex-col items-center justify-center rounded-[2rem] shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-5 rounded-3xl bg-primary/10 text-primary mb-6 transition-transform group-hover:scale-110">
                                    <Camera className="w-10 h-10" />
                                </div>
                                <CardTitle className="text-xl font-black font-headline tracking-tighter">Optical Scanner</CardTitle>
                                <CardDescription className="font-medium text-muted-foreground/60 mt-1">Snapshot questions from your physical media.</CardDescription>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Card onClick={() => fileInputRef.current?.click()} className="cursor-pointer group relative overflow-hidden h-64 border-border/40 bg-card/40 backdrop-blur-xl hover:border-primary/40 transition-all flex flex-col items-center justify-center rounded-[2rem] shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-5 rounded-3xl bg-primary/10 text-primary mb-6 transition-transform group-hover:scale-110">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <CardTitle className="text-xl font-black font-headline tracking-tighter">Database Upload</CardTitle>
                                <CardDescription className="font-medium text-muted-foreground/60 mt-1">Ingest digital snapshots from your local storage.</CardDescription>
                            </Card>
                        </motion.div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                );
            case 'capture':
                return (
                    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
                        <div className="w-full max-w-2xl aspect-[4/3] md:aspect-video bg-black rounded-[2.5rem] overflow-hidden border-4 border-card/40 relative shadow-2xl group">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

                            {/* Ocular Viewfinder UI */}
                            <div className="absolute inset-0 pointer-events-none p-12">
                                <div className="w-full h-full border border-white/10 rounded-3xl relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/20 rounded-full" />
                                </div>
                            </div>

                            <Button onClick={toggleCamera} variant="outline" size="icon" className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60 transition-all">
                                <SwitchCamera className="text-white h-5 w-5" />
                            </Button>
                        </div>
                        {hasCameraPermission === false && (
                            <Alert variant="destructive" className="max-w-lg rounded-2xl border-destructive/20 bg-destructive/5 backdrop-blur-xl">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle className="font-black tracking-tight">Access Denied</AlertTitle>
                                <AlertDescription className="font-medium opacity-80">
                                    The system cannot initialize ocular input. Please grant camera permissions in your browser.
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="flex gap-4">
                            <Button
                                onClick={takePicture}
                                disabled={!hasCameraPermission}
                                size="lg"
                                className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 font-black tracking-widest text-xs uppercase"
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                Snapshot Objective
                            </Button>
                            <Button onClick={reset} variant="secondary" size="lg" className="h-14 px-10 rounded-full bg-card/40 border border-border/40 backdrop-blur-md font-black tracking-widest text-xs uppercase">
                                Abort
                            </Button>
                        </div>
                    </div>
                )
            case 'preview':
                if (isMobile) {
                    return (
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/10 font-black tracking-widest text-[10px] uppercase">Input Data</Badge>
                                </div>
                                <div className="rounded-[2rem] overflow-hidden border-2 border-border/20 shadow-xl bg-card/20">
                                    {imageData && <Image src={imageData} alt="Question preview" width={500} height={300} className="w-full object-contain" />}
                                </div>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button onClick={handleGetAnswer} disabled={isLoading} size="lg" className="flex-1 h-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 font-black tracking-widest text-xs uppercase">
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Analyze Image
                                    </Button>
                                    <Button onClick={reset} variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-border/40 font-black tracking-widest text-xs uppercase">
                                        Recapture
                                    </Button>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {(result || isLoading) && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/10 font-black tracking-widest text-[10px] uppercase">AI Synthesis</Badge>
                                        </div>
                                        <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[300px]">
                                            <CardContent className="p-8">
                                                {isLoading ? (
                                                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                                                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                                        <p className="font-black text-[10px] tracking-[0.3em] uppercase opacity-40">Decrypting Vision Data...</p>
                                                    </div>
                                                ) : result && (
                                                    <div className="space-y-8">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 block">Question Map</p>
                                                            <div className="p-5 rounded-2xl bg-background/20 border border-border/10">
                                                                <p className="font-bold text-lg leading-relaxed italic">"{result.question}"</p>
                                                            </div>
                                                        </div>

                                                        <Separator className="bg-border/10" />

                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 block">Primary Solution</p>
                                                            <p className="text-3xl font-black font-headline tracking-tighter text-primary">{result.answer}</p>
                                                        </div>

                                                        <Separator className="bg-border/10" />

                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 block">Step-by-Step Logic</p>
                                                            <div className="prose prose-sm prose-invert max-w-none pr-4 leading-relaxed font-medium">
                                                                <MathRenderer content={result.solution} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                }

                // Desktop view
                return (
                    <div className="flex flex-col gap-12 animate-in fade-in duration-1000">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Input Image Card */}
                            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="px-3 bg-primary/10 text-primary border-primary/10 font-bold tracking-widest text-[10px] uppercase">Source Data</Badge>
                                    <Button onClick={reset} variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:text-primary">
                                        <SwitchCamera className="mr-2 h-3 w-3" /> Swap Source
                                    </Button>
                                </div>
                                <div className="rounded-[3rem] overflow-hidden border-2 border-border/20 shadow-2xl bg-black relative group">
                                    {imageData && <Image src={imageData} alt="Question preview" width={1200} height={800} className="w-full object-contain max-h-[60vh] transition-transform duration-700 group-hover:scale-[1.02]" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>

                                <Button
                                    onClick={handleGetAnswer}
                                    disabled={isLoading}
                                    size="lg"
                                    className="w-full h-16 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 font-black tracking-widest text-sm uppercase transition-all hover:scale-[1.01] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            Synthesizing Solution...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-3 h-5 w-5" />
                                            {result ? 'Regenerate Logic' : 'Initiate Vision Analysis'}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Results Card */}
                            <div className="lg:col-span-7 space-y-6">
                                <Badge variant="secondary" className="px-3 bg-orange-500/10 text-orange-600 border-orange-500/10 font-bold tracking-widest text-[10px] uppercase">AI Ocular Synthesis</Badge>

                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-full flex flex-col items-center justify-center p-20 rounded-[3rem] bg-card/40 backdrop-blur-3xl border border-border/40 shadow-2xl"
                                        >
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                                                <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
                                            </div>
                                            <h3 className="text-xl font-headline font-black tracking-tighter mb-2">Neural Scan in Progress</h3>
                                            <p className="text-muted-foreground font-medium opacity-60 text-center">Parsing characters and mapping mathematical logic structures...</p>
                                        </motion.div>
                                    ) : result ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="rounded-[3rem] bg-card/40 backdrop-blur-3xl border border-border/40 shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-10 space-y-10">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-1">Objective Identified</p>
                                                    <div className="p-6 rounded-3xl bg-background/20 border border-border/10 shadow-inner">
                                                        <p className="text-xl font-bold italic leading-relaxed text-foreground/90">"{result.question}"</p>
                                                    </div>
                                                </div>

                                                <Separator className="bg-border/10" />

                                                <div className="space-y-10">
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-1">Final Result</p>
                                                        <div className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/20 shadow-2xl text-center relative group overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                            <p className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-primary leading-tight relative z-10">{result.answer}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-1">Synthesis Path</p>
                                                        <div className="p-8 md:p-10 rounded-[3rem] bg-background/30 border border-white/5 backdrop-blur-sm shadow-inner">
                                                            <div className="prose prose-lg prose-invert max-w-none font-medium text-muted-foreground/90 leading-relaxed">
                                                                <MathRenderer content={result.solution} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center p-20 rounded-[3rem] bg-card/20 backdrop-blur-xl border border-border/20 border-dashed"
                                        >
                                            <div className="p-5 rounded-3xl bg-muted/20 text-muted-foreground/40 mb-6">
                                                <Sparkles className="w-12 h-12" />
                                            </div>
                                            <h3 className="text-xl font-headline font-black tracking-tighter mb-2 opacity-40">Awaiting Input Scan</h3>
                                            <p className="text-muted-foreground font-medium opacity-30 text-center max-w-sm">Initiate the analysis to generate AI-driven solutions and step-by-step logic.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <AppLayout>
            <div className="flex-1 p-4 md:p-8 pt-6 relative items-start overflow-hidden min-h-screen">
                {/* Background elements */}
                <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] -z-10" />
                <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] -z-10" />

                <div className="relative z-10 space-y-12 max-w-7xl mx-auto">
                    <div className={cn(
                        "space-y-4 text-center mb-12",
                        mode === 'preview' && !isMobile && 'hidden'
                    )}>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                                <Camera className="h-6 w-6" />
                            </div>
                            <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/5 text-primary border-primary/10">Ocular Synthesis</Badge>
                        </div>
                        <h2 className="text-5xl font-headline font-black tracking-tighter leading-none mb-4">
                            Capture <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Intelligence</span>
                        </h2>
                        <p className="text-muted-foreground font-medium text-xl opacity-70 leading-relaxed max-w-xl mx-auto">
                            Bridge the gap between physical curriculum and AI analysis with high-fidelity visual ingestion.
                        </p>
                    </div>

                    {renderContent()}
                </div>
            </div>
        </AppLayout>
    );
}





