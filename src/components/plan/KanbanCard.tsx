
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

const priorityConfig: Record<TaskPriority, { variant: 'destructive' | 'default' | 'secondary', glow: string, label: string }> = {
  'Hard': { variant: 'destructive', glow: 'bg-red-500/10', label: 'Critical' },
  'Moderate': { variant: 'default', glow: 'bg-primary/10', label: 'Steady' },
  'Easy': { variant: 'secondary', glow: 'bg-green-500/10', label: 'Focus' },
};

export function KanbanCard({ task, moveTask }: KanbanCardProps) {
  const isMobile = useIsMobile();
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const config = priorityConfig[task.priority];

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
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const handleInteraction = () => {
    setShowActions(prev => !prev);
  };

  const handlePointerDown = () => {
    if (isMobile) {
      longPressTimer.current = setTimeout(() => {
        handleInteraction();
      }, 500);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

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
      className="relative mb-3 last:mb-0"
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-border/40 bg-card/30 backdrop-blur-md hover:border-primary/30 hover:bg-card/50 shadow-sm",
          isMobile ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing',
          showActions && 'ring-2 ring-primary border-primary/40',
          isDragging && 'shadow-2xl ring-2 ring-primary'
        )}
        onClick={!isMobile ? handleInteraction : undefined}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerUp}
        onTouchEnd={handlePointerUp}
      >
        {/* Priority Glow */}
        <div className={cn("absolute -right-4 -top-4 h-12 w-12 rounded-full blur-xl opacity-20", config.glow)} />

        <div {...attributes} {...listeners} className="p-4">
          <div className="flex items-start gap-2">
            {!showActions && !isMobile && (
              <GripVertical className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mt-0.5" />
            )}
            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium leading-relaxed text-foreground/90">{task.content}</p>
              <div className="flex justify-between items-center pt-2 border-t border-border/10">
                <Badge variant={config.variant} className="text-[9px] uppercase font-black tracking-tighter px-1.5 py-0">
                  {config.label}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black tracking-tighter text-primary/60">{task.points}</span>
                  <span className="text-[8px] font-bold uppercase text-muted-foreground/40 tracking-widest">pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showActions && (
        <div className="absolute inset-0 flex items-center justify-between p-2 z-20 pointer-events-none">
          <Button
            size="icon"
            className="rounded-full h-8 w-8 bg-background/90 border border-border/50 text-foreground shadow-xl pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              moveTask(task.id, 'left');
            }}
            disabled={!canMoveLeft}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="rounded-full h-8 w-8 bg-background/90 border border-border/50 text-foreground shadow-xl pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              moveTask(task.id, 'right');
            }}
            disabled={!canMoveRight}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
