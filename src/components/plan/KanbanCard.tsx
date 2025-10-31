
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { KanbanTask, TaskPriority } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, GripVertical } from 'lucide-react';

interface KanbanCardProps {
  task: KanbanTask;
  moveTask: (taskId: string, direction: 'left' | 'right') => void;
}

const priorityVariantMap: Record<TaskPriority, 'destructive' | 'default' | 'secondary'> = {
    'Hard': 'destructive',
    'Moderate': 'default',
    'Easy': 'secondary',
};

export function KanbanCard({ task, moveTask }: KanbanCardProps) {
  const isMobile = useIsMobile();
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task }, disabled: showActions });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleInteraction = () => {
    // On desktop, a simple click toggles. On mobile, this is triggered by long press.
    setShowActions(prev => !prev);
  };
  
  const handlePointerDown = () => {
    if (isMobile) {
      longPressTimer.current = setTimeout(() => {
        handleInteraction();
      }, 500); // 500ms for long press
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };
  
  // Clean up timer on unmount
  useEffect(() => {
      return () => {
          if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
          }
      }
  }, []);

  const canMoveLeft = task.columnId === 'in-progress' || task.columnId === 'done';
  const canMoveRight = task.columnId === 'todo' || task.columnId === 'in-progress';

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        className="relative"
    >
        <Card 
            className={cn(
                "p-3 mb-2 bg-secondary shadow-md transition-all", 
                isMobile ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing',
                showActions && 'ring-2 ring-primary'
            )}
            onClick={!isMobile ? handleInteraction : undefined}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerUp} // Cancel long press if user starts dragging
            onTouchEnd={handlePointerUp} // For touch devices
        >
          <div {...attributes} {...listeners} className="flex items-start">
             {!showActions && !isMobile && <GripVertical className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />}
             <div className="flex-1">
                <p className="text-sm">{task.content}</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-muted">
                    <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
                    <span className="text-xs font-bold text-accent">{task.points} pts</span>
                </div>
             </div>
          </div>
        </Card>
        
        {showActions && (
             <div className="absolute inset-0 flex items-center justify-between p-1">
                <Button 
                    size="icon" 
                    className="rounded-full h-8 w-8 bg-background/80 hover:bg-background text-foreground"
                    onClick={() => moveTask(task.id, 'left')}
                    disabled={!canMoveLeft}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                    size="icon" 
                    className="rounded-full h-8 w-8 bg-background/80 hover:bg-background text-foreground"
                    onClick={() => moveTask(task.id, 'right')}
                    disabled={!canMoveRight}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        )}
    </div>
  );
}
