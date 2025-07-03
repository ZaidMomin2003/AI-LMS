'use client';

import { useExam } from "@/context/ExamContext";
import { Button } from "../ui/button";
import { XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const TimeCard = ({ value, unit }: { value: number, unit: string }) => (
    <div className="flex flex-col items-center">
        <div className="text-2xl font-bold font-mono text-sidebar-primary-foreground bg-sidebar-primary rounded-md w-12 py-1">
            {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs uppercase tracking-wider mt-1 text-sidebar-foreground/70">{unit}</div>
    </div>
)

export function ExamCountdown() {
    const { exam, timeLeft, clearExam } = useExam();

    if (!exam || !timeLeft) return null;
    
    return (
        <div className="p-2 space-y-2 rounded-lg bg-sidebar-accent relative group/countdown">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover/countdown:opacity-100 transition-opacity">
                        <XCircle className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete your current exam countdown. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearExam} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate px-1">{exam.name}</p>
            <div className="flex justify-around text-center">
                <TimeCard value={timeLeft.days} unit="Days" />
                <TimeCard value={timeLeft.hours} unit="Hrs" />
                <TimeCard value={timeLeft.minutes} unit="Mins" />
                <TimeCard value={timeLeft.seconds} unit="Secs" />
            </div>
        </div>
    )
}
