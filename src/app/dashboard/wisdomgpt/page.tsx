'use client';

import { AppLayout } from '@/components/AppLayout';
import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { wisdomGptAction } from './actions';

export default function WisdomGptPage() {
    return (
        <AppLayout>
            <div className="flex-1 h-full p-0 md:p-4">
                <WisdomGptChat onSubmit={wisdomGptAction} />
            </div>
        </AppLayout>
    )
}
