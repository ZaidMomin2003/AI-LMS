
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTopic } from '@/context/TopicContext';
import { useRouter } from 'next/navigation';
import { createTopicAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Send, Folder, Gem, Lock, PenSquare } from 'lucide-react';
import Link from 'next/link';
import { useSubject } from '@/context/SubjectContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useSubscription } from '@/context/SubscriptionContext';
import { useProfile } from '@/context/ProfileContext';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Topic must be at least 3 characters.' }).max(100),
  subject: z.string({ required_error: 'Please select a subject.' }),
});

interface TopicFormProps {
  variant?: 'dashboard' | 'chat';
}

const UpgradePrompt = () => (
  <div className="relative rounded-lg border bg-secondary p-4 text-center">
    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
      <Lock className="w-4 h-4" />
    </div>
    <p className="text-sm font-semibold">You've used your free topic generation.</p>
    <p className="text-xs text-muted-foreground mb-3">Upgrade to Pro for unlimited access.</p>
    <Button size="sm" asChild>
      <Link href="/dashboard/pricing"><Gem className="mr-2 h-4 w-4" /> Upgrade</Link>
    </Button>
  </div>
);


export function TopicForm({ variant = 'dashboard' }: TopicFormProps) {
  const { addTopic, loading, setLoading } = useTopic();
  const { subjects: subjectList } = useSubject();
  const { canUseFeature } = useSubscription();
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const { toast } = useToast();

  const canGenerateTopic = canUseFeature('topic');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!profile) {
      toast({
        variant: "destructive",
        title: "Profile Not Loaded",
        description: "Please wait for your profile to load before generating a topic.",
      });
      return;
    }
    if (!canGenerateTopic) {
      toast({
        variant: "destructive",
        title: "Free Limit Reached",
        description: "Please upgrade to a Pro plan to generate more topics.",
      });
      return;
    }

    setLoading(true);
    try {
      const newTopicData = await createTopicAction(values.title, values.subject, profile);
      const newTopic = {
        ...newTopicData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      await addTopic(newTopic);
      toast({
        title: 'Success!',
        description: `Your study materials for "${values.title}" are ready.`,
      });
      router.push(`/topic/${newTopic.id}`);
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'There was a problem generating your topic.',
      });
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  const isPersonalizationComplete = profile && profile.aiName && profile.educationLevel && profile.contentStyle && profile.goal;

  if (subjectList.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Create a Subject First!</AlertTitle>
        <AlertDescription>
          You need to add at least one subject before you can create a topic.
          <Button asChild variant="link" className="p-0 h-auto ml-1">
            <Link href="/dashboard/subjects">Go to Subjects</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!profileLoading && !isPersonalizationComplete) {
    return (
      <Alert>
        <PenSquare className="h-4 w-4" />
        <AlertTitle>Personalize Your AI!</AlertTitle>
        <AlertDescription>
          Please complete your personalization settings to get AI-generated notes tailored to your learning style.
          <Button asChild variant="link" className="p-0 h-auto ml-1">
            <Link href="/dashboard/personalization">Go to Personalization</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!canGenerateTopic) {
    return <UpgradePrompt />;
  }

  const subjectSelectContent = (
    <SelectContent>
      {subjectList.map((subject) => (
        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
      ))}
      <Separator className="my-1" />
      <Button asChild variant="ghost" className="w-full justify-start font-normal h-8">
        <Link href="/dashboard/subjects">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add new subject
        </Link>
      </Button>
    </SelectContent>
  );

  if (variant === 'chat') {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative group">
          <div className="flex items-center gap-2 rounded-full p-1.5 pr-[64px] border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5 group-focus-within:border-primary/40 group-focus-within:ring-4 group-focus-within:ring-primary/5 transition-all duration-300">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Ready to master something new? Type here..."
                      {...field}
                      className="h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-6 text-base font-medium placeholder:text-muted-foreground/40"
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-6 left-6 text-xs text-red-400 font-medium" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="mr-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-auto gap-2 border-border/20 bg-muted/40 hover:bg-muted/60 rounded-full h-10 px-4 transition-colors">
                        <Folder className="h-4 w-4 text-primary/70" />
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                    </FormControl>
                    {subjectSelectContent}
                  </Select>
                  <FormMessage className="absolute -bottom-6 right-6 text-xs text-red-400 font-medium" />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 z-20"
            disabled={loading || profileLoading}
          >
            {loading || profileLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </Form>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  {subjectSelectContent}
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Study Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., The French Revolution" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription>
          What do you want to learn about today? Assign it to a subject.
        </FormDescription>
        <Button type="submit" className="w-full sm:w-auto" disabled={loading || profileLoading}>
          {(loading || profileLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Materials
        </Button>
      </form>
    </Form>
  );
}
