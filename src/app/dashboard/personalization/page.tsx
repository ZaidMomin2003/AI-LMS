
'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const personalizationSchema = z.object({
  studying: z.string().min(2, 'Please specify what you are studying.'),
  aiName: z.string().min(2, 'Please enter a name.'),
  educationLevel: z.string().min(3, 'Please specify your education level.'),
  contentStyle: z.string({ required_error: 'Please select a style.' }),
  goal: z.string({ required_error: 'Please select a goal.' }),
  superpower: z.string({ required_error: "Please select a superpower." }),
  achillesHeel: z.string({ required_error: "Please select your weakness." }),
});

type FormValues = z.infer<typeof personalizationSchema>;

const PersonalizationForm = () => {
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      studying: '',
      aiName: '',
      educationLevel: '',
      contentStyle: '',
      goal: '',
      superpower: '',
      achillesHeel: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        studying: profile.studying || '',
        aiName: profile.aiName || '',
        educationLevel: profile.educationLevel || '',
        contentStyle: profile.contentStyle || '',
        goal: profile.goal || '',
        superpower: profile.superpower || '',
        achillesHeel: profile.achillesHeel || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile(values);
      toast({
        title: 'Preferences Saved!',
        description: 'Your learning experience has been updated.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your preferences. Please try again.',
      });
    }
  };
  
  const isLoading = form.formState.isSubmitting || profileLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your AI</CardTitle>
        <CardDescription>
          Tell us how you like to learn, and we'll tailor the experience for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4 text-lg">
                <span className="font-medium">I am studying</span>
                <FormField
                    control={form.control}
                    name="studying"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                            <FormControl>
                                <Input placeholder="e.g., Middle School" {...field} className="h-9 text-lg min-w-[150px] w-auto inline-block" />
                            </FormControl>
                             <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                 <span className="font-medium">and I want my AI to address me as</span>
                 <FormField
                    control={form.control}
                    name="aiName"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                            <FormControl>
                                <Input placeholder="e.g., Captain" {...field} className="h-9 text-lg min-w-[150px] w-auto inline-block" />
                            </FormControl>
                             <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                <span className="font-medium">. I want it to generate content as per my</span>
                 <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                            <FormControl>
                                <Input placeholder="e.g., High School" {...field} className="h-9 text-lg min-w-[150px] w-auto inline-block" />
                            </FormControl>
                             <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                <span className="font-medium">level. I want content to be</span>
                 <FormField
                    control={form.control}
                    name="contentStyle"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                <SelectTrigger className="h-9 text-lg min-w-[150px] w-auto inline-flex">
                                    <SelectValue placeholder="Select style..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="humorous">Humorous</SelectItem>
                                    <SelectItem value="straight-forward">Straight-forward</SelectItem>
                                    <SelectItem value="easy-to-apply">Easy to apply</SelectItem>
                                    <SelectItem value="detailed">Detailed & Technical</SelectItem>
                                    <SelectItem value="concise">Concise & To-the-Point</SelectItem>
                                    <SelectItem value="creative">Creative & Analogical</SelectItem>
                                    <SelectItem value="formal">Formal & Academic</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                <span className="font-medium">. My biggest goal is to</span>
                <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                <SelectTrigger className="h-9 text-lg min-w-[150px] w-auto inline-flex">
                                    <SelectValue placeholder="Select goal..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ace-exams">Ace my exams</SelectItem>
                                    <SelectItem value="improve-grades">Improve my grades</SelectItem>
                                    <SelectItem value="university-prep">Prepare for university</SelectItem>
                                    <SelectItem value="learn-new-skill">Learn a new skill</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                 <span className="font-medium">. If I had a study superpower, it would be</span>
                  <FormField
                    control={form.control}
                    name="superpower"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                <SelectTrigger className="h-9 text-lg min-w-[150px] w-auto inline-flex">
                                    <SelectValue placeholder="Select superpower..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="photographic-memory">Photographic memory</SelectItem>
                                    <SelectItem value="instant-understanding">Instant understanding</SelectItem>
                                    <SelectItem value="laser-focus">Laser focus</SelectItem>
                                    <SelectItem value="predict-questions">Predicting exam questions</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                 <span className="font-medium">, and my biggest weakness is</span>
                 <FormField
                    control={form.control}
                    name="achillesHeel"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                <SelectTrigger className="h-9 text-lg min-w-[150px] w-auto inline-flex">
                                    <SelectValue placeholder="Select weakness..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="distraction">Getting distracted easily</SelectItem>
                                    <SelectItem value="procrastination">Procrastinating</SelectItem>
                                    <SelectItem value="forgetting">Forgetting information quickly</SelectItem>
                                    <SelectItem value="overthinking">Overthinking details</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs ml-2" />
                        </FormItem>
                    )}
                />
                 <span className="font-medium">.</span>
            </div>
            
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function PersonalizationPage() {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        Personalization
                    </h2>
                    <p className="text-muted-foreground">
                        Tailor your learning experience.
                    </p>
                </div>
                <PersonalizationForm />
            </div>
        </AppLayout>
    );
}
