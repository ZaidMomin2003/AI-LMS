
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { KanbanTask, TaskPriority } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTask } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface KanbanCardProps {
  task: KanbanTask;
}

const priorityVariantMap: Record<TaskPriority, 'destructive' | 'default' | 'secondary'> = {
    'Hard': 'destructive',
    'Moderate': 'default',
    'Easy': 'secondary',
};

export function KanbanCard({ task }: KanbanCardProps) {
  const isMobile = useIsMobile();
  const { setTasks } = useTask();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePointerDown = () => {
    if (isMobile) {
      longPressTimer.current = setTimeout(() => {
        setIsDialogOpen(true);
      }, 500); // 500ms for long press
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const moveTask = (columnId: 'in-progress' | 'done') => {
    setTasks(prev => 
      prev.map(t => t.id === task.id ? { ...t, columnId } : t)
    );
    toast({
        title: 'Task Moved!',
        description: `"${task.content.substring(0, 20)}..." moved to ${columnId === 'in-progress' ? 'In Progress' : 'Completed'}.`
    })
    setIsDialogOpen(false);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
      return () => {
          if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
          }
      }
  }, []);

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerUp} // Cancel long press if user starts dragging
        onTouchEnd={handlePointerUp} // For touch devices
      >
        <Card className={cn("p-3 mb-2 bg-secondary shadow-md hover:shadow-lg transition-shadow", isMobile ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing')}>
          <p className="text-sm">{task.content}</p>
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-muted">
              <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
              <span className="text-xs font-bold text-accent">{task.points} pts</span>
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Move Task</DialogTitle>
                  <DialogDescription>
                    Where would you like to move this task?
                  </DialogDescription>
              </DialogHeader>
              <div className="truncate text-center font-semibold p-2 bg-muted rounded-md">
                {task.content}
              </div>
              <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button 
                    onClick={() => moveTask('in-progress')} 
                    disabled={task.columnId === 'in-progress'}
                  >
                    Move to In Progress
                  </Button>
                  <Button 
                    onClick={() => moveTask('done')}
                    disabled={task.columnId === 'done'}
                  >
                    Move to Completed
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
