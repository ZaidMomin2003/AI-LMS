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
    <div className="flex flex-col items-center flex-1">
        <div className="relative group/time w-full">
            <div className="text-xl font-black font-mono text-primary bg-primary/5 border border-primary/20 backdrop-blur-sm rounded-xl w-full py-2 shadow-inner group-hover/time:border-primary/40 transition-all text-center">
                {String(value).padStart(2, '0')}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/time:opacity-100 transition-opacity rounded-xl" />
            </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-foreground/40">{unit}</div>
    </div>
)

export function ExamCountdown() {
    const { exam, timeLeft, clearExam } = useExam();

    if (!exam || !timeLeft) return null;

    return (
        <div className="mx-2 p-4 pt-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/10 shadow-xl relative group/countdown overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-0 group-hover/countdown:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95">
                        <XCircle className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border-border/10 backdrop-blur-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black text-2xl tracking-tighter uppercase leading-none">Terminate Protocol?</AlertDialogTitle>
                        <AlertDialogDescription className="font-medium text-muted-foreground pt-2">
                            This will permanently delete your neural exam countdown. This action cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-4">
                        <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Back to Study</AlertDialogCancel>
                        <AlertDialogAction onClick={clearExam} className="bg-destructive text-white hover:bg-destructive/90 rounded-xl font-bold uppercase tracking-widest text-[10px]">Delete Goal</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    <p className="text-[11px] font-black text-foreground uppercase tracking-[0.15em] truncate">
                        {exam.name}
                    </p>
                </div>

                <div className="flex justify-between items-center gap-2">
                    <TimeCard value={timeLeft.days} unit="Days" />
                    <TimeCard value={timeLeft.hours} unit="Hrs" />
                    <TimeCard value={timeLeft.minutes} unit="Mins" />
                    <TimeCard value={timeLeft.seconds} unit="Secs" />
                </div>

                <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-blue-500 w-[65%] shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                </div>
            </div>
        </div>
    )
}
