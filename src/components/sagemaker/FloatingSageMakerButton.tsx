
'use client';

import { useState, useRef } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import SageMakerChat from './SageMakerChat';
import { useSubscription } from '@/context/SubscriptionContext';
import { useIsMobile } from '@/hooks/use-mobile';

function DraggableButton({ onClick }: { onClick: () => void }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'sagemaker-button',
  });
  
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(false);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > 5 || dy > 5) { // Drag threshold
      setIsDragging(true);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) {
      onClick();
    }
    setIsDragging(false);
  };

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
    >
        <DialogTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 rounded-full shadow-2xl shadow-primary/30 cursor-grab active:cursor-grabbing"
              // Prevent the DialogTrigger from firing its own click event
              onClick={(e) => {
                  if (isDragging) {
                      e.preventDefault();
                  }
              }}
            >
              <Sparkles className="w-7 h-7" />
            </Button>
        </DialogTrigger>
    </div>
  );
}


export function FloatingSageMakerButton() {
    const { subscription } = useSubscription();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
             activationConstraint: {
                delay: 100, // Shorten delay
                tolerance: 5,
            },
        })
    );
    
    // Do not render the button for hobby users
    if (subscription?.planName === 'Hobby') {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div className="fixed bottom-6 right-6 z-50">
                <DndContext 
                    sensors={sensors}
                    onDragEnd={({ delta }) => {
                        setPosition(({x, y}) => ({ x: x + delta.x, y: y + delta.y }))
                    }}
                    modifiers={[restrictToWindowEdges]}
                >
                    <div style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
                         <DraggableButton onClick={() => setIsOpen(true)} />
                    </div>
                </DndContext>
            </div>
            <DialogContent className="w-[90vw] max-w-3xl h-[85vh] p-0">
                <SageMakerChat />
            </DialogContent>
        </Dialog>
    );
}
