
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
    <Card className="mb-8 border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2rem] overflow-hidden">
      <CardContent className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 group">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Add a new subject, e.g., 'Molecular Biology'"
                      {...field}
                      className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-6 text-base font-medium placeholder:text-muted-foreground/40"
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-6 left-6 text-xs text-red-400 font-medium" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 mr-1"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              <span className="font-bold text-sm">Add Subject</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
