'use client';

import React, { useMemo } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { KanbanTask } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({
    id,
    data: { type: 'Column' },
  });

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <Card
      ref={setNodeRef}
      className="w-[320px] max-w-[320px] flex-shrink-0 bg-background/50 rounded-lg flex flex-col"
    >
      <CardHeader className="p-4 border-b">
        <CardTitle className="font-headline text-lg flex justify-between items-center">
          {title}
          <span className="text-sm font-normal bg-primary/20 text-foreground rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 space-y-2">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
}
