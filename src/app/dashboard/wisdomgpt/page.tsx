
'use client';

import { AppLayout } from '@/components/AppLayout';
import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';

export default function WisdomGptPage() {
    return (
        <AppLayout>
            <div className="flex-1 p-4 h-full">
                <WisdomGptChat />
            </div>
        </AppLayout>
    )
}
