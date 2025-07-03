'use client';

import React, { useMemo } from 'react';
import {
  DndContext,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import type { KanbanTask } from '@/types';

type ColumnId = 'todo' | 'in-progress' | 'done';

const columns: { id: ColumnId, title: string }[] = [
  { id: 'todo', title: 'Syllabus' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Completed' }
];

interface KanbanBoardProps {
    tasks: KanbanTask[];
    setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
}

export function KanbanBoard({ tasks, setTasks }: KanbanBoardProps) {
    const columnIds = useMemo(() => columns.map(col => col.id), []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // Require pointer to move 10px before dragging starts
            },
        })
    );
    
    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (!isActiveATask) return;

        // Dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((currentTasks) => {
                const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
                const overIndex = currentTasks.findIndex((t) => t.id === overId);

                if (currentTasks[activeIndex].columnId !== currentTasks[overIndex].columnId) {
                    currentTasks[activeIndex].columnId = currentTasks[overIndex].columnId;
                    return arrayMove(currentTasks, activeIndex, overIndex);
                }

                return arrayMove(currentTasks, activeIndex, overIndex);
            });
        }

        // Dropping a Task over a Column
        if (isActiveATask && isOverAColumn) {
            setTasks((currentTasks) => {
                const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
                currentTasks[activeIndex].columnId = overId as ColumnId;
                return arrayMove(currentTasks, activeIndex, activeIndex);
            });
        }
    }


    return (
        <DndContext sensors={sensors} onDragOver={onDragOver}>
            <div className="flex gap-4 pb-4">
                <SortableContext items={columnIds}>
                    {columns.map(col => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            tasks={tasks.filter(task => task.columnId === col.id)}
                        />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    )
}
