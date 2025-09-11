
import { Check, X, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const comparisonData = [
    { feature: 'AI Note Generation', alternative: 'Notion AI', price: 96 },
    { feature: 'AI Flashcard Creation', alternative: 'Quizlet Plus', price: 36 },
    { feature: 'AI Quiz Generation', alternative: 'QuillBot Premium', price: 100 },
    { feature: 'Personal AI Tutor (SageMaker)', alternative: 'Chegg Study Pack', price: 240 },
    { feature: 'AI Roadmap Generation', alternative: 'Custom Tutoring Plan', price: 500 },
    { feature: 'Task Management Board', alternative: 'Trello Premium', price: 60 },
    { feature: 'Pomodoro Timer', alternative: 'Focus Keeper Pro', price: 2 },
    { feature: 'Capture the Answer', alternative: 'Photomath Plus', price: 120 },
];

const totalCost = comparisonData.reduce((acc, item) => acc + item.price, 0);

export function ValueComparison() {
    return (
        <section id="value-comparison" className="py-20 sm:py-32 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        All Your Study Tools in One Place
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Getting all these features separately would be a hassle—and expensive. Wisdomis Fun bundles everything you need into one powerful, affordable platform.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>The Old Way: A patchwork of apps</CardTitle>
                                <CardDescription>Juggling multiple subscriptions adds up quickly.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {comparisonData.map((item) => (
                                        <div key={item.feature} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                                            <div className="flex items-center gap-3">
                                                <X className="h-5 w-5 text-destructive" />
                                                <div>
                                                    <p className="font-medium">{item.feature}</p>
                                                    <p className="text-xs text-muted-foreground">via {item.alternative}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="font-mono text-base">${item.price}/yr</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles />
                                    The Wisdomis Fun Way
                                </CardTitle>
                                <CardDescription className="text-primary-foreground/80">Everything included. One simple plan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <div className="space-y-3">
                                    {comparisonData.map((item) => (
                                        <div key={item.feature} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-300" />
                                            <span className="font-medium">{item.feature}</span>
                                        </div>
                                    ))}
                               </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Estimated Annual Cost</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-3xl font-bold text-destructive line-through">
                                    ${totalCost.toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-sm">The Old Way</p>

                                <div className="my-6">
                                    <p className="text-5xl font-bold text-primary">$49</p>
                                    <p className="text-muted-foreground">per year</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    With Wisdomis Fun, you get a comprehensive, all-in-one platform for a fraction of the cost.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
