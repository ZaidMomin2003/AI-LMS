
'use client';

import { useRoadmap } from "@/context/RoadmapContext";
import { useTask } from "@/context/TaskContext";
import { format, isToday } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Info } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

export function TodayStudyTask() {
    const { roadmap } = useRoadmap();
    const { addTask, findTaskById } = useTask();
    const { toast } = useToast();

    const todaysTask = useMemo(() => {
        if (!roadmap || !roadmap.plan) return null;
        
        return roadmap.plan.find(day => {
            try {
                const taskDate = new Date(day.date);
                return isToday(taskDate);
            } catch (e) {
                console.error("Invalid date format from roadmap:", day.date);
                return false;
            }
        }) || null;
    }, [roadmap]);
    
    const taskUniqueId = useMemo(() => {
        if (!todaysTask) return null;
        try {
            const todayFormatted = format(new Date(todaysTask.date), 'yyyy-MM-dd');
            return `roadmap-task-${todayFormatted}`;
        } catch (e) {
            return null;
        }
    }, [todaysTask]);

    const taskInKanban = taskUniqueId ? findTaskById(taskUniqueId) : null;
    const isCompleted = taskInKanban?.columnId === 'done';

    const handleToggleComplete = () => {
        if (!todaysTask || !taskUniqueId || isCompleted) return;

        addTask(
            `Roadmap: ${todaysTask.topicsToCover.substring(0, 50)}...`, 
            'Moderate', 
            'done',
            taskUniqueId
        );

        toast({
            title: "Congratulations! 🥳",
            description: "You've completed today's study goal. Great work!",
        });
    }

    if (!todaysTask) {
        return (
            <Card className="h-full">
                <CardHeader className="p-3">
                    <CardTitle className="font-headline text-base">Today's Goal</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 flex items-center justify-center text-center h-[calc(100%-4rem)]">
                    <div className="space-y-1">
                        <Info className="w-6 h-6 text-muted-foreground mx-auto"/>
                        <p className="text-sm text-muted-foreground">No plan for today.</p>
                        <Button variant="link" asChild className="text-xs p-0 h-auto">
                            <Link href="/dashboard/roadmap">Create a roadmap</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="p-3">
                <CardTitle className="font-headline text-base">Today's Study Goal</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex-1 flex items-center">
                <div className="flex items-start gap-3 w-full">
                     <Checkbox 
                        id="today-task-checkbox" 
                        checked={isCompleted} 
                        onCheckedChange={handleToggleComplete}
                        className="mt-1"
                        aria-label="Mark task as complete"
                     />
                     <div className="flex-1">
                        <label 
                            htmlFor="today-task-checkbox" 
                            className={cn(
                                "text-sm font-medium transition-colors",
                                isCompleted && "line-through text-muted-foreground"
                            )}
                        >
                            {todaysTask.topicsToCover}
                        </label>
                     </div>
                </div>
            </CardContent>
        </Card>
    )
}
