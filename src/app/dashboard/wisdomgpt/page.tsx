
'use client';

import { AppLayout } from '@/components/AppLayout';
import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { wisdomGptAction } from './actions';

export default function WisdomGptPage() {
    return (
        <AppLayout>
            <div className="flex-1 flex flex-col h-[calc(100vh_-_theme(spacing.14))]">
                <WisdomGptChat />
            </div>
        </AppLayout>
    )
}
