
'use client';

import { Send, Bot, Code, ShoppingCart, Truck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const SuggestionCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="bg-secondary p-3 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-primary/20 transition-colors">
        <div className="bg-primary/20 text-primary p-2 rounded-full">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </div>
)

export function ChatMain() {
  const { user } = useAuth();
  
  return (
    <div className="h-full flex flex-col bg-card border rounded-lg relative overflow-hidden">
       <div 
         className="absolute inset-0 bg-grid-pattern opacity-10"
         style={{ backgroundSize: '2rem 2rem' }}
       />
       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-primary rounded-full blur-2xl animate-pulse" />
                <Image src="https://placehold.co/128x128.png" data-ai-hint="glowing orb" alt="AI Orb" width={128} height={128} className="relative rounded-full" />
            </div>

            <h1 className="text-4xl font-bold font-headline text-foreground">
                Welcome back, {user?.displayName || 'Alex'}!
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                What can I help you with today? Type your query below to get started.
            </p>
        </div>

        <div className="p-4 relative z-10 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <SuggestionCard icon={Truck} title="Search for suppliers" description="We will find suppliers with the best prices" />
                <SuggestionCard icon={ShoppingCart} title="Select materials" description="AI will select the best materials" />
                <SuggestionCard icon={Code} title="Calculation of the cost" description="Summarise the price" />
            </div>
            <div className="relative">
                <Bot className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Tell us about your capabilities" className="pl-12 pr-12 h-12 rounded-full bg-secondary" />
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-primary">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
  );
}
