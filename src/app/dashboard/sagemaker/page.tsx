'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Paperclip, Send, User, X, Sparkles, Loader2, Mic } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { sageMakerAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Inputs = {
  prompt: string;
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

// Add SpeechRecognition types to window for browser compatibility
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


export default function SageMakerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setValue('prompt', transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast({
            variant: "destructive",
            title: "Voice Recognition Error",
            description: event.error === 'no-speech' ? 'No speech was detected.' : 'An error occurred during voice recognition.',
          });
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [setValue, toast]);


  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
         toast({
            variant: "destructive",
            title: "Not Supported",
            description: "Your browser may not support voice recognition.",
         });
      }
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.prompt.trim() && !imageData) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: data.prompt };
    if (imagePreview) {
        userMessage.image = imagePreview;
    }
    setMessages((prev) => [...prev, userMessage]);
    reset();
    removeImage();

    try {
      const response = await sageMakerAction({
        prompt: data.prompt,
        imageDataUri: imageData,
      });
      
      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
      toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Could not get a response from the AI. Please check the console for more details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 flex justify-center items-center">
        <Card className="w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl">
          <CardHeader className="border-b">
            <CardTitle className="font-headline flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                SageMaker
                <p className="text-sm font-normal text-muted-foreground">Your personal AI study assistant</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-6 space-y-6">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground">
                    <Bot size={48} className="mx-auto mb-2"/>
                    <p>Start a conversation by asking a question.</p>
                    <p className="text-sm">You can also upload an image or use your voice.</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                       <Avatar>
                         <AvatarFallback><Bot/></AvatarFallback>
                       </Avatar>
                    )}
                    <div className={`rounded-2xl p-4 max-w-[75%] ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary rounded-bl-none'}`}>
                      {message.image && (
                         <Image src={message.image} alt="User upload" width={200} height={200} className="rounded-lg mb-2" />
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <Avatar>
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-4">
                        <Avatar>
                         <AvatarFallback><Bot/></AvatarFallback>
                       </Avatar>
                       <div className="rounded-2xl p-4 max-w-[75%] bg-secondary rounded-bl-none flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin"/>
                       </div>
                   </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
             <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
                {imagePreview && (
                    <div className="relative">
                        <Image src={imagePreview} alt="Preview" width={40} height={40} className="rounded-md object-cover" />
                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-muted-foreground text-background rounded-full p-0.5">
                            <X size={12} />
                        </button>
                    </div>
                )}
                <Input {...register('prompt')} placeholder="Ask anything, or use the mic..." autoComplete='off' disabled={isLoading} />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isRecording}>
                    <Paperclip size={20} />
                    <span className="sr-only">Attach file</span>
                </Button>
                <Button type="button" variant={isRecording ? "destructive" : "outline"} size="icon" onClick={handleMicClick} disabled={isLoading}>
                    <Mic size={20} className={cn(isRecording && "animate-pulse")} />
                    <span className="sr-only">{isRecording ? 'Stop recording' : 'Record voice'}</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || isRecording}>
                    <Send size={20} />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
