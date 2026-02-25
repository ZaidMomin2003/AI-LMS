
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Exam name must be at least 3 characters.' }),
  date: z.date({
    required_error: "An exam date is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AddExamForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { addExam } = useExam();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    addExam({
      ...values,
      date: values.date.toISOString(),
    });
    toast({
      title: "Exam Set!",
      description: `Your countdown for "${values.name}" has begun.`
    })
    router.push('/dashboard');
    setIsLoading(false);
  }

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <CardHeader className="pb-2">
        <CardTitle className="font-black text-2xl tracking-tighter uppercase opacity-80">Target Configuration</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Exam Designation</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="e.g., Strategic Molecular Biology"
                          {...field}
                          className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Execution Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 md:h-14 bg-background/20 border-border/10 rounded-2xl px-4 font-bold text-left transition-all hover:bg-background/40 hover:border-border/20",
                              !field.value && "text-muted-foreground/30"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMMM do, yyyy")
                            ) : (
                              <span className="opacity-30">Assign final date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-40 text-primary" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl border-border/10 bg-background/95 backdrop-blur-3xl shadow-3xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 md:h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative flex items-center justify-center">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">Initiate Countdown</span>}
                {!isLoading && <div className="p-1 rounded-full bg-white/20 ml-1"><CalendarIcon className="h-3 w-3" /></div>}
              </div>
            </Button>
          </form>
        </Form>

        <div className="mt-8 flex items-center justify-center gap-6 opacity-20 filter grayscale">
          <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-border" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Milestone Locked</span>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-1 rounded-full bg-border" />)}
            </div>
          </div>
          <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </CardContent>
    </Card>
  );
}
