
'use client';

import { useRoadmap } from "@/context/RoadmapContext";
import { useTask } from "@/context/TaskContext";
import { format, isToday } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Info, ListTodo } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSubscription } from "@/context/SubscriptionContext";
import { ScrollArea } from "../ui/scroll-area";

export function TodayStudyTask() {
    const { roadmap } = useRoadmap();
    const { addTask, findTaskById } = useTask();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { canUseFeature } = useSubscription();

    const canUseRoadmap = canUseFeature('roadmap');

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

        if (isMobile) {
            setIsDialogOpen(false);
        }
    }

    const TaskContent = () => (
        <div className="flex items-start gap-3 w-full p-3">
            <Checkbox
                id="today-task-checkbox"
                checked={isCompleted}
                onCheckedChange={handleToggleComplete}
                className="mt-1"
                aria-label="Mark task as complete"
            />
            <div className="flex-1">
                <ScrollArea className="h-full max-h-[100px] pr-4">
                    <label
                        htmlFor="today-task-checkbox"
                        className={cn(
                            "text-sm font-medium transition-colors whitespace-normal",
                            isCompleted && "line-through text-muted-foreground"
                        )}
                    >
                        {todaysTask!.topicsToCover}
                    </label>
                </ScrollArea>
            </div>
        </div>
    );

    const NoTaskContent = () => (
        <div className="space-y-1 p-3 flex-1 flex flex-col items-center justify-center text-center">
            <Info className="w-6 h-6 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No plan for today.</p>
            <Button variant="link" asChild className="text-xs p-0 h-auto">
                <Link href="/dashboard/roadmap">
                    {canUseRoadmap ? 'Create a roadmap' : 'Upgrade to create a roadmap'}
                </Link>
            </Button>
        </div>
    );

    if (isMobile) {
        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm">
                        <ListTodo className="h-5 w-5" />
                        <span className="sr-only">View Today's Task</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem] border-border/50 backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl font-bold">Daily Objective</DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            Focused learning target from your active roadmap.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        {todaysTask ? <TaskContent /> : <NoTaskContent />}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Card className="h-full border-border/40 bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="p-5 pb-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <ListTodo className="w-4 h-4" />
                    </div>
                    <CardTitle className="font-headline text-sm font-bold tracking-tight">Daily Goal</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-1 flex items-center">
                {todaysTask ? <TaskContent /> : <NoTaskContent />}
            </CardContent>
        </Card>
    )
}
