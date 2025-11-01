
'use client';

import { AppLayout } from '@/components/AppLayout';
import SageMakerChat from '@/components/sagemaker/SageMakerChat';

export default function SageMakerPage() {
    return (
        <AppLayout>
            <div className="flex-1 p-4 md:p-6 h-full">
                <SageMakerChat />
            </div>
        </AppLayout>
    )
}
