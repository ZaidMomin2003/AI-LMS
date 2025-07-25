
import { AppLayout } from '@/components/AppLayout';
import { ChatMain } from '@/components/chat/ChatMain';
import { ChatSidebar } from '@/components/chat/ChatSidebar';

export default function ChatPage() {
    return (
        <AppLayout>
            <div className="flex-1 p-4 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] h-full gap-4">
                    <ChatSidebar />
                    <ChatMain />
                </div>
            </div>
        </AppLayout>
    )
}
