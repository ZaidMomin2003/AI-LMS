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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TaskPriority } from '@/types';
import { useState } from 'react';
import { Loader2, Plus, LayoutList } from 'lucide-react';

const formSchema = z.object({
  content: z.string().min(3, { message: 'Task must be at least 3 characters long.' }),
  priority: z.enum(['Easy', 'Moderate', 'Hard']),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTaskFormProps {
  onTaskCreate: (content: string, priority: TaskPriority) => void;
}


export function CreateTaskForm({ onTaskCreate }: CreateTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      priority: 'Moderate',
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    onTaskCreate(values.content, values.priority as TaskPriority);
    form.reset();
    setIsLoading(false);
  }

  return (
    <Card className="mb-6 border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-[3]">
                    <div className="flex items-center gap-2 px-4 rounded-2xl bg-background/30 border border-border/20 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
                      <LayoutList className="h-4 w-4 text-muted-foreground/40" />
                      <FormControl>
                        <Input
                          placeholder="What's your next study goal? e.g., Master Biochemistry Chapter 2"
                          {...field}
                          className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 text-base font-medium placeholder:text-muted-foreground/40"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="absolute mt-1 text-[10px] text-red-400 font-bold uppercase" />
                  </FormItem>
                )}
              />
              <div className="flex flex-1 gap-3">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-2xl bg-background/30 border-border/20 hover:bg-background/50 transition-colors px-4 font-bold text-sm">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border/40 backdrop-blur-xl">
                          <SelectItem value="Easy" className="focus:bg-green-500/10 focus:text-green-500">Easy</SelectItem>
                          <SelectItem value="Moderate" className="focus:bg-primary/10 focus:text-primary">Moderate</SelectItem>
                          <SelectItem value="Hard" className="focus:bg-red-500/10 focus:text-red-500">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 rounded-2xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  <span className="font-bold text-sm">Add Task</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
