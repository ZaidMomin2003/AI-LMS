
'use client';

import React, { useMemo } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { KanbanTask } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: KanbanTask[];
  moveTask: (taskId: string, direction: 'left' | 'right') => void;
}


export function KanbanColumn({ id, title, tasks, moveTask }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({
    id,
    data: { type: 'Column' },
  });

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className="w-[320px] max-w-[320px] flex-shrink-0 flex flex-col h-full group"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-black font-headline uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary/60 transition-colors">
          {title}
        </h3>
        <Badge variant="secondary" className="bg-primary/5 text-primary/60 border-primary/10 font-black text-[10px]">
          {tasks.length}
        </Badge>
      </div>

      <div className="flex-1 p-2 space-y-3 bg-card/20 backdrop-blur-xl rounded-[2rem] border border-border/40 overflow-y-auto scrollbar-none shadow-inner min-h-[500px]">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} moveTask={moveTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}
