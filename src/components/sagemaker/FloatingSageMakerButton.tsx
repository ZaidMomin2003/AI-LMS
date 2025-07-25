
'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import SageMakerChat from './SageMakerChat';
import { useSubscription } from '@/context/SubscriptionContext';
import { useDraggable } from '@dnd-kit/core';

export function FloatingSageMakerButton() {
    const { subscription } = useSubscription();
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const nodeRef = useRef(null);
    
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'sagemaker-button',
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : {};
    
    // Do not render the button for hobby users
    if (subscription?.planName === 'Hobby') {
        return null;
    }

    const handlePointerDown = () => {
        setIsDragging(false);
    };

    const handlePointerMove = () => {
        setIsDragging(true);
    };

    const handlePointerUp = () => {
        if (!isDragging) {
            setIsOpen(true);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50" ref={nodeRef} style={style}>
                <DialogTrigger asChild>
                    <Button
                      ref={setNodeRef}
                      {...listeners}
                      {...attributes}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      size="icon"
                      className="w-14 h-14 rounded-full shadow-2xl shadow-primary/30 cursor-grab active:cursor-grabbing"
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
