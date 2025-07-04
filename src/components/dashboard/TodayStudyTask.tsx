'use client';

import { useRoadmap } from "@/context/RoadmapContext";
import { useTask } from "@/context/TaskContext";
import { format, isToday } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Info } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function TodayStudyTask() {
    const { roadmap } = useRoadmap();
    const { addTask, findTaskById } = useTask();
    const { toast } = useToast();

    const todayString = format(new Date(), 'MMMM d, yyyy');

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

    const handleCompleteTask = () => {
        if (!todaysTask || !taskUniqueId) return;

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
                <CardHeader>
                    <CardTitle className="font-headline">Today's Goal</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center h-[150px]">
                    <Info className="w-8 h-8 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">No study plan set for today.</p>
                    <Button variant="link" asChild>
                        <Link href="/dashboard/roadmap">Create a roadmap</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">What to study today</CardTitle>
                <CardDescription>From your roadmap for {todayString}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 h-[125px] overflow-y-auto pr-2">
                <p className="whitespace-pre-wrap text-sm">{todaysTask.topicsToCover}</p>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handleCompleteTask} disabled={isCompleted}>
                    {isCompleted ? (
                        <>
                            <Check className="mr-2 h-4 w-4"/>
                            Completed!
                        </>
                    ) : (
                        "Mark as Complete"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
