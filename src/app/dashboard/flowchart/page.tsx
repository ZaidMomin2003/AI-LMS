'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Workflow, X, PlusCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createFlowchartAction } from './actions';

const formSchema = z.object({
  topics: z
    .array(
      z.object({
        value: z.string().min(3, { message: 'Topic must be at least 3 characters.' }),
      })
    )
    .min(3, 'Please provide at least 3 topics.')
    .max(6, 'You can add a maximum of 6 topics.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function FlowchartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [flowchartSvg, setFlowchartSvg] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topics: [{ value: '' }, { value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'topics',
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setFlowchartSvg(null);
    try {
      const topicStrings = values.topics.map(t => t.value);
      const result = await createFlowchartAction({ topics: topicStrings });
      setFlowchartSvg(result.svg);
      toast({
        title: 'Flowchart Generated!',
        description: 'Your syllabus flowchart is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not create the flowchart. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleDownload = () => {
    if (!flowchartSvg) return;
    const blob = new Blob([flowchartSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowchart.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight flex items-center gap-2">
            <Workflow /> AI Flowchart Maker
          </h2>
          <p className="text-muted-foreground">
            Visualize your syllabus. Enter up to 6 core topics, and let AI build a flowchart for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Enter Syllabus Topics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`topics.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="sr-only">Topic {index + 1}</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input placeholder={`Topic ${index + 1}`} {...field} />
                                                    </FormControl>
                                                    {fields.length > 3 && (
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            
                             <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ value: "" })}
                                disabled={fields.length >= 6}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Topic
                            </Button>

                            <FormDescription>
                                Provide between 3 and 6 topics for the best results.
                            </FormDescription>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><Wand2 className="mr-2 h-4 w-4" /> Create Flowchart</>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Generated Flowchart</CardTitle>
                    {flowchartSvg && (
                         <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center bg-muted/50 rounded-b-lg p-4">
                    {isLoading && (
                        <div className="text-center text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Building your flowchart...</p>
                        </div>
                    )}
                    {!isLoading && flowchartSvg && (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: flowchartSvg }} />
                    )}
                     {!isLoading && !flowchartSvg && (
                        <div className="text-center text-muted-foreground">
                            <Workflow className="h-12 w-12 mx-auto mb-4" />
                            <p>Your flowchart will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
