
import { AppLayout } from '@/components/AppLayout';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight flex items-center gap-2">
                        <MessageSquare /> Chat
                    </h2>
                    <p className="text-muted-foreground">
                        This is the new chat page. Ready for your instructions!
                    </p>
                </div>
                {/* Content will go here */}
            </div>
        </AppLayout>
    )
}
