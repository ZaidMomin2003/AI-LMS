
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { partnerChatAction } from '@/app/becomepartner/actions';

type Inputs = {
  prompt: string;
};

interface Message {
  role: 'user' | 'model';
  content: string;
}

const suggestedQuestions = [
    "What are the benefits for teachers?",
    "How does pricing work for schools?",
    "How do you ensure student data privacy?",
];

export function PartnerChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.prompt.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: data.prompt };
    const currentMessages: Message[] = [...messages, userMessage];
    setMessages(currentMessages);
    reset();
    
    const history = currentMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }]
    }));
    
    try {
      const response = await partnerChatAction({ history, message: data.prompt });
      setMessages((prev) => [...prev, { role: 'model', content: response.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', content: "Sorry, I seem to have short-circuited for a moment. Please try asking that again, or use the form on this page to contact my human colleagues!" }]);
      toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Could not get a response from the AI.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setValue('prompt', question);
    // You could also auto-submit here if you want:
    // handleSubmit(onSubmit)();
  }

  return (
    <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
            <Card className="w-full max-w-4xl mx-auto h-[70vh] flex flex-col shadow-2xl shadow-primary/10 border-primary/20">
            <CardHeader className="border-b">
                <CardTitle className="font-headline flex items-center gap-3 text-2xl">
                <Sparkles className="w-8 h-8 text-primary" />
                <div>
                    Ask Our Partnership AI
                    <p className="text-sm font-normal text-muted-foreground">Get instant answers about collaborating with Wisdomis Fun.</p>
                </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-6 space-y-6">
                    {messages.length === 0 && (
                    <div className="text-center text-muted-foreground pt-10 flex flex-col items-center gap-4">
                        <Bot size={48} className="mx-auto mb-2"/>
                        <p className="font-medium">Ask me anything about our school programs!</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {suggestedQuestions.map((q, i) => (
                                <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(q)}>
                                    {q}
                                </Button>
                            ))}
                        </div>
                    </div>
                    )}
                    {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'model' && (
                        <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot/></AvatarFallback>
                        </Avatar>
                        )}
                        <div className={`rounded-2xl p-4 max-w-[75%] ${message.role === 'user' ? 'bg-secondary rounded-br-none' : 'bg-secondary rounded-bl-none'}`}>
                            <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\* (.*?)(?:\n|$)/g, '<li>$1</li>') }}/>
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
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot/></AvatarFallback>
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
                    <Input {...register('prompt')} placeholder="Ask a question..." autoComplete='off' disabled={isLoading} />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send size={20} />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
            </Card>
        </div>
    </section>
  );
}
