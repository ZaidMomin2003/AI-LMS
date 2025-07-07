
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
import { Loader2, Lock, Star } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Topic must be at least 3 characters.' }).max(100),
});

export function TopicForm() {
  const { topics, addTopic, loading, setLoading } = useTopic();
  const { subscription } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const isLocked = subscription?.planName === 'Hobby' && topics.length >= 1;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const newTopicData = await createTopicAction(values.title);
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

  if (isLocked) {
      return (
          <Card className="text-center bg-secondary">
             <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Lock className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline pt-2">Free Topic Limit Reached</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">You've generated your free topic. To create unlimited study materials, please upgrade your plan.</p>
             </CardContent>
             <div className="p-6 pt-0">
                 <Button asChild>
                    <Link href="/pricing">
                        <Star className="mr-2 h-4 w-4" />
                        Upgrade Plan
                    </Link>
                </Button>
             </div>
          </Card>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The French Revolution, Quantum Physics" {...field} />
              </FormControl>
              <FormDescription>
                What do you want to learn about today?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Materials
        </Button>
      </form>
    </Form>
  );
}
