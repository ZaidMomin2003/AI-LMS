
'use client';

import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';

export default function WisdomGptPage() {
    return (
        // The container now fills the parent space provided by the AppLayout
        <div className="h-full">
            <WisdomGptChat />
        </div>
    )
}
