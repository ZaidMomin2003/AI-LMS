
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Wand2, Clock, CalendarCheck, Gem, Lock, Target, Map as MapIcon, PlusCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createRoadmapAction } from './actions';
import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import { useRoadmap } from '@/context/RoadmapContext';
import { useSubscription } from '@/context/SubscriptionContext';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
    syllabus: z.string().min(20, { message: 'Syllabus must be at least 20 characters.' }),
    hoursPerDay: z.coerce.number().min(1, { message: 'Must study at least 1 hour a day.' }).max(12, { message: 'Study hours cannot exceed 12 per day.' }),
    targetDate: z.date({ required_error: 'A target date is required.' }),
});

const UpgradePrompt = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-auto mt-12"
    >
        <Card className="text-center border-primary/20 bg-primary/5 backdrop-blur-xl shadow-2xl shadow-primary/10 rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-2xl w-fit mb-4 shadow-lg shadow-primary/20">
                    <Gem className="w-8 h-8" />
                </div>
                <CardTitle className="font-headline text-2xl font-black">Ascend to Pro</CardTitle>
                <CardDescription className="text-muted-foreground font-medium px-4">You've unlocked the potential of one roadmap. Upgrade to generate unlimited strategic paths.</CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
                <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Link href="/dashboard/pricing">
                        Unlock Unlimited Roadmaps
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </motion.div>
);

export default function RoadmapPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { roadmap, setRoadmap } = useRoadmap();
    const { toast } = useToast();
    const { canUseFeature } = useSubscription();
    const canCreateRoadmap = canUseFeature('roadmap');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            syllabus: '',
            hoursPerDay: 4,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!canCreateRoadmap) {
            toast({
                variant: "destructive",
                title: "Free Limit Reached",
                description: "Please upgrade to Pro to create more roadmaps.",
            });
            return;
        }
        setIsLoading(true);
        setRoadmap(null);
        try {
            const input = {
                ...values,
                targetDate: format(values.targetDate, 'yyyy-MM-dd'),
                startDate: format(new Date(), 'yyyy-MM-dd'),
            };
            const result = await createRoadmapAction(input);
            setRoadmap(result);
            toast({
                title: 'Roadmap Generated!',
                description: 'Your personalized study plan is ready.',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not create the roadmap. Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const renderForm = () => (
        <Card className="max-w-4xl mx-auto border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2 opacity-60">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Parameters</span>
                </div>
                <CardTitle className="text-2xl font-black font-headline tracking-tighter">Roadmap Architect</CardTitle>
                <CardDescription className="text-muted-foreground/60 font-medium">Input your curriculum and time constraints to synthesize your path.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="syllabus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 block ml-1">The Curriculum</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Paste your syllabus topics here for AI analysis..."
                                                className="min-h-[200px] rounded-2xl border-border/20 bg-background/20 focus:bg-background/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-base px-6 py-5 placeholder:text-muted-foreground/20 leading-relaxed resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="hoursPerDay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 block ml-1">Daily Capacity</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 group-focus-within:bg-primary/10 transition-colors">
                                                        <Clock className="h-3 w-3 text-primary/60 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="12"
                                                        className="h-14 pl-14 rounded-2xl border-border/20 bg-background/20 focus:bg-background/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-base"
                                                        {...field}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest pointer-events-none">
                                                        Hours
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="targetDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 block ml-1">Deadline Horizon</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn('h-14 w-full text-left font-bold rounded-2xl border-border/20 bg-background/20 hover:bg-background/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all px-5', !field.value && 'text-muted-foreground/30')}
                                                        >
                                                            <CalendarIcon className="mr-3 h-4 w-4 text-primary/40" />
                                                            {field.value ? format(field.value, 'PPP') : <span>Set Target Date</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-2xl border-border/40 backdrop-blur-3xl shadow-2xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading || (!canCreateRoadmap && !!roadmap)}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] text-base font-black tracking-tight flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Computing Optimal Path...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                        <span>Initiate Strategy Synthesis</span>
                                        <ArrowRight className="h-4 w-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
            <div className="flex-1 p-4 md:p-8 pt-6 relative min-h-screen items-start overflow-x-hidden">
                {/* Background patterns */}
                <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
                <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/5 blur-[120px] -z-10" />

                <div className="relative z-10 space-y-12 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-4">
                        <div className="space-y-4 max-w-3xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm border border-orange-500/10">
                                    <MapIcon className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] bg-orange-500/5 text-orange-600 border-orange-500/10">Strategic Hub</Badge>
                            </div>
                            <div>
                                <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tighter leading-none mb-4">
                                    Syllabus <span className="bg-gradient-to-r from-orange-400 to-primary bg-clip-text text-transparent">Navigator</span>
                                </h2>
                                <p className="text-muted-foreground font-medium text-lg md:text-xl opacity-70 leading-relaxed max-w-2xl">
                                    Architect a personalized, data-driven timeline from your curriculum data and master your goals with AI precision.
                                </p>
                            </div>
                        </div>
                        {roadmap && roadmap.plan.length > 0 && canCreateRoadmap && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                <Button
                                    onClick={() => setRoadmap(null)}
                                    variant="secondary"
                                    className="rounded-full h-11 px-6 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black text-xs uppercase tracking-widest transition-all"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Synthesize New Plan
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {isLoading && (
                        <div className="space-y-8 mt-12">
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping" />
                                    <div className="relative flex items-center justify-center w-full h-full bg-primary/10 rounded-3xl border border-primary/20 shadow-xl">
                                        <Wand2 className="w-10 h-10 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black font-headline tracking-tight mb-2">Synthesizing Your Future...</h3>
                                <p className="text-muted-foreground font-medium max-w-xs mx-auto opacity-70">Wisdom AI is currently distributing your topics across the optimal study timeline.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-48 rounded-[2rem] border border-border/40 bg-card/20 animate-pulse relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {roadmap && roadmap.plan.length > 0 ? (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {roadmap.plan.map((day, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="group flex flex-col h-full border-border/40 bg-card/30 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 rounded-[2rem] overflow-hidden transition-all duration-500 relative">
                                                {/* Light Leak */}
                                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

                                                <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10 p-6">
                                                    <div className="space-y-1">
                                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.1em] border-border/50 text-muted-foreground/60 transition-colors group-hover:text-primary/60 group-hover:border-primary/20">
                                                            {day.dayOfWeek}
                                                        </Badge>
                                                        <CardTitle className="text-lg font-black font-headline tracking-tighter leading-none">{day.date}</CardTitle>
                                                    </div>
                                                    <div className="h-10 w-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-1 px-6 pb-2 relative z-10">
                                                    <div className="p-4 rounded-2xl bg-background/40 border border-border/20 min-h-[100px] flex items-center">
                                                        <p className="text-sm font-medium text-foreground/80 whitespace-pre-wrap leading-relaxed italic">"{day.topicsToCover}"</p>
                                                    </div>
                                                </CardContent>
                                                <div className="p-6 pt-2 pb-6 relative z-10">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                                                            <span className="text-[10px] font-black tracking-tighter text-primary">{day.estimatedHours}h</span>
                                                            <span className="text-[8px] font-bold uppercase text-muted-foreground/40 tracking-widest leading-none">Estimate</span>
                                                        </div>
                                                        <Badge variant="secondary" className="rounded-full bg-secondary/50 text-muted-foreground text-[9px] font-bold uppercase tracking-widest border-border/50">Day {index + 1}</Badge>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-12 max-w-2xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-[3rem] bg-gradient-to-br from-green-500/10 via-primary/5 to-purple-500/10 border border-green-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group"
                                >
                                    <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-green-500/5 blur-[100px]" />
                                    <div className="flex items-center items-start gap-6 relative z-10">
                                        <div className="h-20 w-20 flex-shrink-0 rounded-[2rem] bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-500">
                                            <CalendarCheck className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Badge className="bg-green-500 hover:bg-green-500 text-white border-0 font-black text-[10px] uppercase tracking-widest shadow-sm">Plan Optimized</Badge>
                                            <h4 className="text-3xl font-black font-headline tracking-tighter leading-none">Tactical Edge Secured.</h4>
                                            <p className="text-lg text-muted-foreground font-medium opacity-80 leading-snug">
                                                You have officially synthesized a <span className="text-green-500 font-bold">{roadmap.plan.length}-day</span> training cycle. Your trajectory is calibrated for absolute success.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            {!canCreateRoadmap && <UpgradePrompt />}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {!isLoading && renderForm()}
                            {!canCreateRoadmap && roadmap && <UpgradePrompt />}
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
