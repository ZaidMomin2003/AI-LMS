
'use client';

import { Search, MoreHorizontal, FileBox } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const chatHistory = [
  { group: 'Today', chats: ['Tell us about your capabilities'] },
  { group: 'Yesterday', chats: ['Tell us about your capabilities'] },
  { group: 'Last 7 days', chats: ['Tell us about your capabilities'] },
];

const HistoryItem = ({ text }: { text: string }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary cursor-pointer">
        <p className="text-sm truncate">{text}</p>
        <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
        </Button>
    </div>
);


export function ChatSidebar() {
  return (
    <div className="h-full flex-col bg-card border rounded-lg p-4 hidden lg:flex">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <FileBox className="h-6 w-6" />
                <h2 className="text-lg font-bold font-headline">History</h2>
            </div>
        </div>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
        </div>
        <ScrollArea className="flex-1 -mx-4">
            <div className="px-4 space-y-4">
            {chatHistory.map(group => (
                <div key={group.group}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{group.group}</h3>
                    <div className="space-y-1">
                        {group.chats.map((chat, i) => <HistoryItem key={i} text={chat} />)}
                    </div>
                </div>
            ))}
            </div>
        </ScrollArea>
        <div className="mt-4">
            <Card className="bg-secondary">
                <CardContent className="p-4 text-center">
                    <p className="text-sm font-semibold mb-2">Purchase a subscription</p>
                    <p className="text-xs text-muted-foreground mb-4">Unlock over 15 new features</p>
                    <Button asChild size="sm" className="w-full">
                        <Link href="/pricing">Upgrade</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
