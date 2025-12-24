
'use client';

import { Check, Gem, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const freeFeatures = [
    { text: '3 Topic Generations', included: true },
    { text: '1 Study Roadmap Generation', included: true },
    { text: '3 Pomodoro Sessions', included: true },
    { text: '3 Uses of the Capture Tool', included: true },
];

const proFeatures = [
    { text: 'Unlimited Topic Generations', included: true },
    { text: 'Unlimited Study Roadmaps', included: true },
    { text: 'Unlimited Pomodoro Sessions', included: true },
    { text: 'Unlimited Capture Tool Usage', included: true },
    { text: 'Unlimited WisdomGPT AI', included: true },
    { text: 'Priority Email Support', included: true },
];

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const year = new Date().getFullYear();
        const difference = +new Date(`12/31/${year}`) - +new Date();
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
        // Set initial time on mount to avoid hydration mismatch
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const timerComponents: {unit: 'days' | 'hours' | 'minutes' | 'seconds', label: string}[] = [
        { unit: 'days', label: 'Days' },
        { unit: 'hours', label: 'Hrs' },
        { unit: 'minutes', label: 'Mins' },
        { unit: 'seconds', label: 'Secs' },
    ];
    
    if (!timeLeft) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 sm:gap-4">
            {timerComponents.map(part => (
                <div key={part.unit} className="flex flex-col items-center">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-primary-foreground bg-black rounded-md w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                        {String(timeLeft[part.unit] || 0).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider mt-1 text-primary-foreground/70">{part.label}</div>
                </div>
            ))}
        </div>
    );
};


export function Pricing() {
    const monthlyPrice = (199 / 12).toFixed(2);
    return (
        <section id="pricing" className="py-20 sm:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Title and philosophy */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                                Pricing
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                No hidden fees, just transparent pricing for your academic success.
                            </p>
                        </div>
                        <div className="border-t border-border pt-6">
                            <h3 className="font-semibold text-foreground">This isn't just a tool</h3>
                            <p className="mt-2 text-muted-foreground">
                                We maintain quality by focusing on features that genuinely enhance learning and save you time.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Pricing Cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Free Plan */}
                        <Card className="flex flex-col h-full border-border/60 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Scholar</CardTitle>
                                <CardDescription>For trying out the core features.</CardDescription>
                                <div className="pt-4">
                                    <span className="text-4xl font-bold text-foreground">$0</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <ul className="space-y-3">
                                    {freeFeatures.map(feature => (
                                        <li key={feature.text} className="flex items-center gap-3 text-sm">
                                            <Check className="w-5 h-5 text-foreground" />
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant="outline">
                                    <Link href="/signup">Get Started for Free</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="relative flex flex-col h-full bg-foreground text-background border-primary/50 shadow-2xl shadow-primary/20 overflow-hidden">
                            <div className="absolute top-0 right-0 -z-1 w-52 h-52 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-full blur-3xl" />
                            <CardHeader className="bg-gradient-to-br from-primary/20 via-foreground to-foreground p-6">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="font-headline text-2xl">Sage</CardTitle>
                                    <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                                        <Sparkles className="h-4 h-4" />
                                        Best Value
                                    </div>
                                </div>
                                <CardDescription className="text-background/70">For dedicated students and professionals.</CardDescription>
                                <div className="pt-4 text-center sm:text-left">
                                    <span className="text-4xl font-bold text-background">${monthlyPrice}</span>
                                    <span className="text-background/70"> / month</span>
                                    <p className="text-xs text-background/60 mt-1">Billed annually at $199</p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <ul className="space-y-3">
                                    {proFeatures.map(feature => (
                                        <li key={feature.text} className="flex items-center gap-3 text-sm">
                                            <Check className="w-5 h-5 text-primary" />
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full bg-background text-foreground hover:bg-background/90">
                                    <Link href="/signup">
                                        <Gem className="mr-2 h-4 w-4" />
                                        Go Pro
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Lifetime Deal Section */}
                 <div className="mt-16">
                    <Card className="relative w-full overflow-hidden bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-2xl shadow-primary/30">
                        <div 
                            className="absolute inset-0 bg-repeat bg-[url('https://res.cloudinary.com/dfhpkqrjw/image/upload/v1717676769/confetti_y39svn.gif')]"
                            style={{ opacity: 0.1, backgroundSize: '300px' }} 
                        />
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{backgroundSize: '30px 30px'}}/>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
                            <div className="md:col-span-1 space-y-2">
                                 <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-xs font-medium mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Christmas Special</span>
                                </div>
                                <h3 className="text-2xl font-headline font-bold">Lifetime Sage</h3>
                                <p className="text-primary-foreground/80">Unlimited access, forever. One payment, endless learning.</p>
                            </div>

                            <div className="md:col-span-1 flex items-center justify-center">
                                <CountdownTimer />
                            </div>

                            <div className="md:col-span-1 flex flex-col items-center md:items-end text-center md:text-right">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-semibold line-through text-primary-foreground/70">$999</span>
                                    <p className="text-4xl font-bold">$799</p>
                                </div>
                                <p className="text-sm text-primary-foreground/80">One-time payment</p>
                                 <Button asChild className="mt-4 w-full md:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                                    <Link href="/signup">
                                        Get Lifetime Access
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </section>
    )
}
