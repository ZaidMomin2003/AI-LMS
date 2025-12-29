
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, List, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ComingSoonFeature = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <li className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary rounded-full p-1.5 mt-1">
            {icon}
        </div>
        <span className="text-muted-foreground flex-1">{text}</span>
    </li>
);

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date(`2026-01-20T00:00:00`) - +new Date();
        let timeLeft: {days: number, hours: number, minutes: number, seconds: number} | {} = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft as {days: number, hours: number, minutes: number, seconds: number};
    };

    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

     useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    
    if (!timeLeft) {
        return null; // Don't render until client-side calculation is done
    }

    const timerComponents: {unit: 'days' | 'hours' | 'minutes' | 'seconds', label: string}[] = [
        { unit: 'days', label: 'Days' },
        { unit: 'hours', label: 'Hrs' },
        { unit: 'minutes', label: 'Mins' },
        { unit: 'seconds', label: 'Secs' },
    ];

    return (
        <div className="flex items-center gap-4">
            {timerComponents.map(part => (
                <div key={part.unit} className="flex flex-col items-center">
                    <div className="text-3xl font-bold font-mono text-primary bg-primary/10 rounded-md w-16 h-16 flex items-center justify-center">
                        {String(timeLeft[part.unit] || 0).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider mt-2 text-muted-foreground">{part.label}</div>
                </div>
            ))}
        </div>
    );
};


export default function CustomQuizPage() {
  return (
    <AppLayout>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="max-w-2xl w-full text-center shadow-lg border-primary/20">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <CardTitle className="font-headline text-3xl">Advanced Quiz Generator Launching Soon!</CardTitle>
            <CardDescription className="text-lg pt-2">
              Our revolutionary tool to supercharge your study sessions arrives on January 20, 2026.
            </CardDescription>
            <div className="pt-6 flex justify-center">
                <CountdownTimer />
            </div>
          </CardHeader>
          <CardContent className="text-left space-y-6 pt-6">
            <div>
                <h3 className="font-semibold text-center mb-4">You'll soon be able to:</h3>
                <ul className="space-y-4 max-w-md mx-auto">
                    <ComingSoonFeature icon={<FileText size={20} />} text="Upload your own PDF & PPT documents." />
                    <ComingSoonFeature icon={<List size={20} />} text="Paste a syllabus or just type in topic names." />
                </ul>
            </div>
            <div className="border-t pt-6">
                <h3 className="font-semibold text-center mb-4">To generate question types like:</h3>
                <div className="flex justify-center flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Multiple Choice</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />True/False</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Fill in the Blanks</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Matching</div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
