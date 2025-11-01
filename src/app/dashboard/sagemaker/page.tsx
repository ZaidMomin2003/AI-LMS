
'use client';

import { AppLayout } from '@/components/AppLayout';
import SageMakerChat from '@/components/sagemaker/SageMakerChat';

export default function SageMakerPage() {
    return (
        <AppLayout>
            <div className="flex-1 p-4 h-full">
                <SageMakerChat />
            </div>
        </AppLayout>
    )
}
