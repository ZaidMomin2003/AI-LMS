'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { KanbanTask, TaskPriority } from '@/types';

interface KanbanCardProps {
  task: KanbanTask;
}

const priorityVariantMap: Record<TaskPriority, 'destructive' | 'default' | 'secondary'> = {
    'Hard': 'destructive',
    'Moderate': 'default',
    'Easy': 'secondary',
};

export function KanbanCard({ task }: KanbanCardProps) {
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="p-3 mb-2 bg-secondary shadow-md hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing">
        <p className="text-sm">{task.content}</p>
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-muted">
            <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
            <span className="text-xs font-bold text-accent">{task.points} pts</span>
        </div>
      </Card>
    </div>
  );
}
