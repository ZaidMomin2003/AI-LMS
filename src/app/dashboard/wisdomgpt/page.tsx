
'use client';

import { AppLayout } from '@/components/AppLayout';
import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { wisdomGptAction } from './actions';

export default function WisdomGptPage() {
    return (
        <AppLayout>
            <div className="flex-1 h-full flex flex-col">
                <WisdomGptChat />
            </div>
        </AppLayout>
    )
}

    