
'use client';

import { Check, Gem, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const freeFeatures = [
    { text: '1 Topic Generation', included: true },
    { text: '1 Study Roadmap Generation', included: true },
    { text: '1 Pomodoro Session', included: true },
    { text: '1 Use of the Capture Tool', included: true },
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
                                <CardDescription>For casual learners and to try us out.</CardDescription>
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
                                    <div className="flex items-center gap-1 rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                                        <Sparkles className="h-4 w-4" />
                                        Best Value
                                    </div>
                                </div>
                                <CardDescription className="text-background/70">For dedicated students and professionals.</CardDescription>
                                <div className="pt-4">
                                    <span className="text-4xl font-bold text-background">$199</span>
                                    <span className="text-background/70"> / year</span>
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
            </div>
        </section>
    )
}
