
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import SageMakerChat from './SageMakerChat';
import { useSubscription } from '@/context/SubscriptionContext';


export function FloatingSageMakerButton() {
    const { subscription } = useSubscription();
    const [isOpen, setIsOpen] = useState(false);
    
    // Do not render the button for hobby users
    if (subscription?.planName === 'Hobby') {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50">
                 <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="w-14 h-14 rounded-full shadow-2xl shadow-primary/30"
                    >
                      <Sparkles className="w-7 h-7" />
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent className="w-[90vw] max-w-3xl h-[85vh] p-0">
                <SageMakerChat />
            </DialogContent>
        </Dialog>
    );
}
