
'use client';

import { Check, Gem, Lock, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const freeFeatures = [
    { text: '1 Topic Generation', included: true },
    { text: '1 Study Roadmap Generation', included: true },
    { text: '1 Pomodoro Session', included: true },
    { text: '1 Use of the Capture Tool', included: true },
    { text: 'Unlimited WisdomGPT AI', included: false },
    { text: 'Priority Email Support', included: false },
];

const proFeatures = [
    { text: 'Unlimited Topic Generations', included: true },
    { text: 'Unlimited Study Roadmaps', included: true },
    { text: 'Unlimited Pomodoro Sessions', included: true },
    { text: 'Unlimited Capture Tool Usage', included: true },
    { text: 'Unlimited WisdomGPT AI', included: true },
    { text: 'Priority Email Support', included: true },
];


export function Pricing() {
    return (
        <section id="pricing" className="py-20 sm:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Choose Your Plan
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Start for free, and upgrade when you're ready to unlock your full potential.
                    </p>
                </div>
                <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
                    {/* Free Plan */}
                    <Card className="flex flex-col">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">Scholar</CardTitle>
                            <CardDescription>
                                <span className="text-4xl font-bold text-foreground">$0</span>
                                <span className="text-muted-foreground">/ forever</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                            <p className="text-center text-sm text-muted-foreground">Get a taste of our core features, absolutely free.</p>
                             <ul className="space-y-3">
                                {freeFeatures.map(feature => (
                                    <li key={feature.text} className={cn("flex items-center gap-3 text-sm", !feature.included && "text-muted-foreground")}>
                                        {feature.included ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-muted-foreground" />}
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
                    <Card className="relative flex flex-col border-primary ring-2 ring-primary shadow-2xl shadow-primary/20">
                         <div className="absolute top-0 right-4 -translate-y-1/2">
                            <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                <Sparkles className="h-4 w-4" />
                                Best Value
                            </div>
                        </div>
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">Sage</CardTitle>
                             <CardDescription>
                                <span className="text-4xl font-bold text-foreground">$199</span>
                                <span className="text-muted-foreground">/ year</span>
                            </CardDescription>
                        </CardHeader>
                         <CardContent className="space-y-4 flex-1">
                            <p className="text-center text-sm text-muted-foreground">Unlock unlimited access to every AI tool.</p>
                             <ul className="space-y-3">
                                {proFeatures.map(feature => (
                                    <li key={feature.text} className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/signup">
                                    <Gem className="mr-2 h-4 w-4" />
                                    Go Pro
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    )
}
