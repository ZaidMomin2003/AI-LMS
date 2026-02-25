
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
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your preferences. Please try again.',
      });
    }
  };

  const isLoading = form.formState.isSubmitting || profileLoading;

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <CardHeader>
        <CardTitle className="font-black text-2xl tracking-tighter uppercase opacity-80">Cognitive Alignment</CardTitle>
        <CardDescription className="font-medium opacity-60">
          Synthesize your learning preferences to optimize AI-human knowledge transfer.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-6 text-xl md:text-2xl leading-relaxed tracking-tight">
              <span className="font-medium opacity-80">I am currently mastering</span>
              <FormField
                control={form.control}
                name="studying"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <FormControl>
                      <Input placeholder="Subject area..." {...field} className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus-visible:ring-0 focus-visible:border-primary transition-colors min-w-[200px] w-auto inline-block text-primary" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">and I prefer my AI navigator to address me as</span>
              <FormField
                control={form.control}
                name="aiName"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <FormControl>
                      <Input placeholder="e.g. Scholar" {...field} className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus-visible:ring-0 focus-visible:border-primary transition-colors min-w-[150px] w-auto inline-block text-primary" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">. Generate all synthetic content at my</span>
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <FormControl>
                      <Input placeholder="e.g. Graduate" {...field} className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus-visible:ring-0 focus-visible:border-primary transition-colors min-w-[180px] w-auto inline-block text-primary" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">competency level. I want the delivery style to be</span>
              <FormField
                control={form.control}
                name="contentStyle"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus:ring-0 focus:border-primary transition-colors min-w-[200px] w-auto inline-flex text-primary">
                          <SelectValue placeholder="Style..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-border/10 bg-background/95 backdrop-blur-3xl">
                        <SelectItem value="humorous">Humorous & Engaging</SelectItem>
                        <SelectItem value="straight-forward">Straight-forward</SelectItem>
                        <SelectItem value="easy-to-apply">Easy to Apply</SelectItem>
                        <SelectItem value="detailed">Detailed & Technical</SelectItem>
                        <SelectItem value="concise">Concise & Direct</SelectItem>
                        <SelectItem value="creative">Creative & Analogical</SelectItem>
                        <SelectItem value="formal">Formal & Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">. My primary objective is to</span>
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus:ring-0 focus:border-primary transition-colors min-w-[200px] w-auto inline-flex text-primary">
                          <SelectValue placeholder="Objective..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-border/10 bg-background/95 backdrop-blur-3xl">
                        <SelectItem value="ace-exams">Ace My Exams</SelectItem>
                        <SelectItem value="improve-grades">Improve Academic Standing</SelectItem>
                        <SelectItem value="university-prep">University Preparation</SelectItem>
                        <SelectItem value="learn-new-skill">Master New Domain</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">. If I possessed a cognitive superpower, it would be</span>
              <FormField
                control={form.control}
                name="superpower"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus:ring-0 focus:border-primary transition-colors min-w-[220px] w-auto inline-flex text-primary">
                          <SelectValue placeholder="Superpower..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-border/10 bg-background/95 backdrop-blur-3xl">
                        <SelectItem value="photographic-memory">Photographic Memory</SelectItem>
                        <SelectItem value="instant-understanding">Instant Comprehension</SelectItem>
                        <SelectItem value="laser-focus">Hyper-Focus</SelectItem>
                        <SelectItem value="predict-questions">Question Prediction</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">, whereas my tactical weakness is</span>
              <FormField
                control={form.control}
                name="achillesHeel"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-primary/5 border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none h-10 text-xl font-bold px-1 focus:ring-0 focus:border-primary transition-colors min-w-[220px] w-auto inline-flex text-primary">
                          <SelectValue placeholder="Weakness..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-border/10 bg-background/95 backdrop-blur-3xl">
                        <SelectItem value="distraction">External Distractions</SelectItem>
                        <SelectItem value="procrastination">Chronic Procrastination</SelectItem>
                        <SelectItem value="forgetting">Knowledge Volatility</SelectItem>
                        <SelectItem value="overthinking">Cognitive Over-analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <span className="font-medium opacity-80">.</span>
            </div>

            <div className="flex justify-start pt-6 border-t border-border/5">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 px-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Calibrate Learning Engine'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function PersonalizationPage() {
  return (
    <AppLayout>
      <div className="flex-1 relative overflow-hidden bg-background">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

        <div className="relative z-10 p-4 md:p-8 pt-6 max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter leading-none">
              Personal<span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">ization</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium opacity-70">
              Tailor the core algorithms to align with your neural learning patterns.
            </p>
          </div>

          <PersonalizationForm />
        </div>
      </div>
    </AppLayout>
  );
}
