
'use client';

import WisdomGptChat from '@/components/wisdomgpt/WisdomGptChat';
import { wisdomGptAction } from './actions';

export default function WisdomGptPage() {
    return (
        <div className="flex-1 flex flex-col h-full">
            <WisdomGptChat />
        </div>
    )
}
