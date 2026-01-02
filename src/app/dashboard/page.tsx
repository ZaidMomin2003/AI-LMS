import { AppLayout } from '@/components/AppLayout';
import { ChatMain } from '@/components/chat/ChatMain';

export default function DashboardPage() {
    return (
        <AppLayout>
            <div className="flex-1 h-full">
                <ChatMain />
            </div>
        </AppLayout>
    )
}
