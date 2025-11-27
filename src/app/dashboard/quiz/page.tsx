
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2, Wand2, FileQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type GenerateCustomQuizOutput } from '@/ai/flows/generate-custom-quiz';
import { z } from 'zod';
import { createQuizAction } from './actions';
import { MathRenderer } from '@/components/MathRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';

const GenerateCustomQuizInputSchema = z.object({
  topics: z.string().min(3, { message: 'Topics must be at least 3 characters long.' }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  numQuestions: z.coerce.number().min(1, 'Please enter at least 1 question.').max(20, 'You can generate a maximum of 20 questions.'),
  questionType: z.enum(['Multiple Choice', 'True/False', 'Fill in the Blanks']),
});

type FormValues = z.infer<typeof GenerateCustomQuizInputSchema>;

export default function CustomQuizPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<GenerateCustomQuizOutput | null>(null);
  const [currentQuestionType, setCurrentQuestionType] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(GenerateCustomQuizInputSchema),
    defaultValues: {
      topics: '',
      difficulty: 'Medium',
      numQuestions: 5,
      questionType: 'Multiple Choice',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setQuizResult(null);
    setCurrentQuestionType(values.questionType);
    try {
      const result = await createQuizAction(values);
      setQuizResult(result);
      toast({
        title: 'Quiz Generated!',
        description: 'Your custom quiz is ready below.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not create the quiz. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const renderQuiz = () => {
    if (!quizResult || !quizResult.questions || quizResult.questions.length === 0) return null;

    return (
        <div className="space-y-4">
            {quizResult.questions.map((q: any, index: number) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <CardDescription>{q.question.replace(/____/g, '_________')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentQuestionType === 'Multiple Choice' && (
                            <div className="space-y-2">
                                {q.options.map((opt: string, i: number) => (
                                    <p key={i} className={`text-sm p-2 rounded-md ${opt === q.answer ? 'bg-green-500/20 text-green-200' : 'bg-muted'}`}>
                                        {opt === q.answer && '✓ '}{opt}
                                    </p>
                                ))}
                            </div>
                        )}
                         {currentQuestionType === 'True/False' && (
                            <p className="text-sm p-2 rounded-md bg-green-500/20 text-green-200">
                                Correct Answer: {q.answer.toString()}
                            </p>
                        )}
                        {currentQuestionType === 'Fill in the Blanks' && (
                             <p className="text-sm p-2 rounded-md bg-green-500/20 text-green-200">
                                Correct Answer(s): {q.answers.join(', ')}
                            </p>
                        )}
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-muted-foreground font-semibold">EXPLANATION</p>
                            <p className="text-sm"><MathRenderer content={q.explanation} /></p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  return (
    <AppLayout>
      <ScrollArea className="h-[calc(100vh-56px)]">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            AI Quiz Generator
          </h2>
          <p className="text-muted-foreground">
            Create custom quizzes on any topic. Just provide the content and set your preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics or Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your notes, a chapter summary, or list key topics..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Provide the source material for the quiz.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="numQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                                    <SelectItem value="True/False">True/False</SelectItem>
                                    <SelectItem value="Fill in the Blanks">Fill in the Blanks</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...</>
                  ) : (
                    <><Wand2 className="mr-2 h-4 w-4" /> Create Quiz</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {isLoading && (
             <div className="text-center p-8">
                 <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                 <p className="mt-4 text-muted-foreground">AI is crafting your questions...</p>
             </div>
        )}

        {quizResult && (
            <div className="mt-8">
                <h3 className="text-2xl font-headline font-bold tracking-tight mb-4">Your Custom Quiz</h3>
                {renderQuiz()}
            </div>
        )}

      </div>
      </ScrollArea>
    </AppLayout>
  );
}
