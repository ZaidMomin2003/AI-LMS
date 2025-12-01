
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
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  const renderContent = () => {
    if (!canUseCapture && mode === 'idle') {
      return (
        <Card className="max-w-md w-full text-center mx-auto">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline">Capture is a Pro Feature</CardTitle>
                <CardDescription>You've used your free capture. Upgrade to get unlimited access.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard/pricing">
                        <Gem className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                    </Link>
                </Button>
            </CardContent>
        </Card>
      );
    }
    
    switch(mode) {
        case 'idle':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card onClick={startCamera} className="cursor-pointer hover:border-primary transition-colors text-center p-8 flex flex-col items-center justify-center">
                        <Camera className="w-12 h-12 text-primary mb-4" />
                        <CardTitle>Capture Image</CardTitle>
                        <CardDescription>Use your camera to snap a photo of the question.</CardDescription>
                    </Card>
                    <Card onClick={() => fileInputRef.current?.click()} className="cursor-pointer hover:border-primary transition-colors text-center p-8 flex flex-col items-center justify-center">
                        <Upload className="w-12 h-12 text-primary mb-4" />
                        <CardTitle>Upload Image</CardTitle>
                        <CardDescription>Select an image of the question from your device.</CardDescription>
                    </Card>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
            );
        case 'capture':
            return (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-full max-w-lg aspect-video bg-muted rounded-lg overflow-hidden border relative">
                         <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                         <Button onClick={toggleCamera} variant="outline" size="icon" className="absolute bottom-4 right-4 rounded-full bg-background/50 backdrop-blur-sm">
                            <SwitchCamera />
                        </Button>
                    </div>
                     {hasCameraPermission === false && (
                        <Alert variant="destructive" className="max-w-lg">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Camera Access Denied</AlertTitle>
                          <AlertDescription>
                            Please allow camera access in your browser to use this feature.
                          </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex gap-4">
                        <Button onClick={takePicture} disabled={!hasCameraPermission} size="lg">Take Picture</Button>
                        <Button onClick={reset} variant="outline" size="lg">Cancel</Button>
                    </div>
                </div>
            )
        case 'preview':
            if (isMobile) {
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-headline text-xl">Your Question</h3>
                            {imageData && <Image src={imageData} alt="Question preview" width={500} height={300} className="rounded-lg border object-contain" />}
                            <div className="flex gap-4">
                                <Button onClick={handleGetAnswer} disabled={isLoading} size="lg">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Get Answer
                                </Button>
                                 <Button onClick={reset} variant="outline" size="lg">Try Again</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                             {result && (
                                <>
                                    <h3 className="font-headline text-xl">AI's Answer</h3>
                                    <Card className="min-h-[300px] flex items-center justify-center">
                                        <CardContent className="p-6 w-full">
                                            {isLoading && <div className="text-center text-muted-foreground">Analyzing...</div>}
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="font-semibold text-muted-foreground text-sm">Question Identified:</p>
                                                    <p className="font-medium italic">"{result.question}"</p>
                                                </div>
                                                <Separator/>
                                                <div>
                                                     <p className="font-semibold text-muted-foreground text-sm">Direct Answer:</p>
                                                     <p className="font-bold text-lg text-primary">{result.answer}</p>
                                                </div>
                                                 <Separator/>
                                                <div>
                                                     <p className="font-semibold text-muted-foreground text-sm">Solution:</p>
                                                     <div className="prose prose-sm prose-invert max-w-none">
                                                        <MathRenderer content={result.solution} />
                                                     </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                             )}
                              {!result && !isLoading && (
                                 <Card className="min-h-[300px] flex items-center justify-center">
                                     <CardContent className="p-6 w-full text-center text-muted-foreground">
                                         The answer and solution will appear here.
                                     </CardContent>
                                 </Card>
                             )}
                             {isLoading && (
                                <Card className="min-h-[300px] flex items-center justify-center">
                                    <CardContent className="p-6 w-full text-center text-muted-foreground">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                );
            }
            // Desktop/Tablet view
            return (
                <div className="w-full relative">
                    {imageData && (
                        <div className="relative w-full h-[60vh] mb-8">
                             <Image src={imageData} alt="Question preview" layout="fill" className="object-contain" />
                        </div>
                    )}
                    <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                        <div className="max-w-4xl mx-auto space-y-4">
                            <Card className="border-border/50 bg-background/80 backdrop-blur-md shadow-2xl">
                                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button onClick={handleGetAnswer} disabled={isLoading} size="lg" className="w-full sm:w-auto">
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        {result ? 'Regenerate' : 'Get Answer'}
                                    </Button>
                                    <Button onClick={reset} variant="outline" size="lg" className="w-full sm:w-auto">
                                        Try Again
                                    </Button>
                                </CardContent>
                            </Card>

                            {result && (
                                <Card className="border-border/50 bg-background/80 backdrop-blur-md shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="font-headline">AI Solution</CardTitle>
                                        <CardDescription className="italic">"{result.question}"</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="font-semibold text-muted-foreground text-xs">Direct Answer:</p>
                                                <p className="font-bold text-base text-primary">{result.answer}</p>
                                            </div>
                                            <Separator/>
                                            <div>
                                                <p className="font-semibold text-muted-foreground text-xs">Step-by-Step Solution:</p>
                                                <div className="prose prose-sm prose-invert max-w-none pr-4">
                                                    <MathRenderer content={result.solution} />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {isLoading && (
                                <div className="text-center text-foreground h-32 flex items-center justify-center">
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                    Analyzing...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
    }
  }

  return (
    <AppLayout>
      <div className={cn(
          "flex-1 space-y-4", 
          mode !== 'preview' || isMobile ? 'p-4 md:p-8 pt-6' : 'p-2'
      )}>
        <div className={cn(
            "space-y-2",
            mode === 'preview' && !isMobile && 'hidden' // Hide title on desktop preview
        )}>
          <h2 className="text-3xl font-headline font-bold tracking-tight">Capture the Answer</h2>
          <p className="text-muted-foreground">
            Stuck on a problem? Just show it to our AI.
          </p>
        </div>
        
        {renderContent()}
      </div>
    </AppLayout>
  );
}

    