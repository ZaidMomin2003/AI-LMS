
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

const formSchema = z.object({
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters.' }).max(50),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSubjectFormProps {
  onAddSubject: (subject: string) => void;
}

export function AddSubjectForm({ onAddSubject }: AddSubjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    onAddSubject(values.subject);
    form.reset();
    setIsLoading(false);
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-start">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Add a new subject, e.g., 'Computer Science'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">Add Subject</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
