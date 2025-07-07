
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Wand2, Clock, CalendarCheck, Lock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createRoadmapAction } from './actions';
import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import { useRoadmap } from '@/context/RoadmapContext';
import { useSubscription } from '@/context/SubscriptionContext';
import Link from 'next/link';

const formSchema = z.object({
  syllabus: z.string().min(20, { message: 'Syllabus must be at least 20 characters.' }),
  hoursPerDay: z.coerce.number().min(1, { message: 'Must study at least 1 hour a day.' }).max(12, { message: 'Study hours cannot exceed 12 per day.' }),
  targetDate: z.date({ required_error: 'A target date is required.' }),
});

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { roadmap, setRoadmap } = useRoadmap();
  const { toast } = useToast();
  const { subscription } = useSubscription();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      syllabus: '',
      hoursPerDay: 4,
    },
  });

  const isLocked = subscription?.planName === 'Hobby' && !!roadmap;

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            Create Your Study Roadmap
          </h2>
          <p className="text-muted-foreground">
            Let AI build a personalized, day-by-day study plan to help you ace your goals.
          </p>
        </div>

        {isLocked ? (
           <Card className="text-center">
             <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Lock className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline pt-2">Roadmap Limit Reached</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
                <p className="text-muted-foreground">You've used your one free AI roadmap generation.</p>
                <p className="text-muted-foreground">Upgrade to a premium plan to create unlimited roadmaps!</p>
             </CardContent>
             <div className="p-6 pt-0">
                 <Button asChild>
                    <Link href="/pricing">
                        <Star className="mr-2 h-4 w-4" />
                        Upgrade Your Plan
                    </Link>
                </Button>
             </div>
           </Card>
        ) : (
            <Card>
            <CardHeader>
                <CardTitle>Roadmap Generator</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="syllabus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Syllabus / Topics</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Paste your full syllabus here, or list all the topics you need to cover."
                            className="min-h-[150px]"
                            {...field}
                            />
                        </FormControl>
                        <FormDescription>The more detail you provide, the better the plan.</FormDescription>
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
                            <FormLabel>How many hours do you study a day?</FormLabel>
                            <FormControl>
                            <Input type="number" min="1" max="12" {...field} />
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
                            <FormLabel>Target Date</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn('w-full text-left font-normal', !field.value && 'text-muted-foreground')}
                                >
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                        </>
                    ) : (
                        <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Create My Plan
                        </>
                    )}
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        )}

        {isLoading && (
            <div className="space-y-4 mt-8">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-xl font-headline mb-4 text-center">Building your roadmap...</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="h-5 bg-muted rounded w-2/4 animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                                    </div>
                                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

        {roadmap && roadmap.plan.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-headline font-bold tracking-tight mb-4">Your Study Roadmap</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmap.plan.map((day, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-bold font-headline">{day.date}</CardTitle>
                    <span className="text-xs text-muted-foreground">{day.dayOfWeek}</span>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{day.topicsToCover}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        Est. {day.estimatedHours} {day.estimatedHours > 1 ? 'hours' : 'hour'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-4 bg-secondary">
                <CardContent className="p-4 flex items-center gap-3">
                    <CalendarCheck className="w-8 h-8 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Plan Complete!</h4>
                        <p className="text-sm text-muted-foreground">You have {roadmap.plan.length} days of studying planned. Good luck!</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
