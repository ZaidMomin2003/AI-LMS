import { AppLayout } from '@/components/AppLayout';
import { ChatMain } from '@/components/chat/ChatMain';

export default function DashboardPage() {
    return (
        <AppLayout>
            <div className="flex-1 p-4 h-full">
                <ChatMain />
            </div>
        </AppLayout>
    )
}
