
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

const personalizationSchema = z.object({
  studying: z.string().min(2, 'Please specify what you are studying.'),
  aiName: z.string().min(2, 'Please enter a name.'),
  educationLevel: z.string().min(3, 'Please specify your education level.'),
  contentStyle: z.string({ required_error: 'Please select a style.' }),
});

type FormValues = z.infer<typeof personalizationSchema>;

const PersonalizationForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(personalizationSchema),
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    // Logic to save personalization settings will be added later
  };
  
  const isLoading = form.formState.isSubmitting;

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
                                <Input placeholder="e.g., AP Biology" {...field} className="h-9 text-lg min-w-[150px] w-auto inline-block" />
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
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
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
