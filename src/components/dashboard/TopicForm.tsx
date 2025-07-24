
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
import { Loader2, PlusCircle } from 'lucide-react';
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

const formSchema = z.object({
  title: z.string().min(3, { message: 'Topic must be at least 3 characters.' }).max(100),
  subject: z.string({ required_error: 'Please select a subject.' }),
});

export function TopicForm() {
  const { addTopic, loading, setLoading } = useTopic();
  const { subjects: subjectList } = useSubject();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const newTopicData = await createTopicAction(values.title, values.subject);
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

  if (subjectList.length === 0) {
    return (
        <Alert>
            <Info className="h-4 w-4"/>
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
                    <SelectContent>
                      {subjectList.map((subject) => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                      <div className="p-1 mt-1 border-t">
                         <Button asChild variant="ghost" className="w-full justify-start text-sm">
                           <Link href="/dashboard/subjects">
                             <PlusCircle className="mr-2 h-4 w-4" />
                             Add new subject
                           </Link>
                         </Button>
                      </div>
                    </SelectContent>
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
        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Materials
        </Button>
      </form>
    </Form>
  );
}
