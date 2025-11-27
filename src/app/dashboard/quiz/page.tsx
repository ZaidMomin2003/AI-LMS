
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
import { Loader2, Wand2, FileQuestion, Upload, List, Plus, X, File } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
  const [topicList, setTopicList] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
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
  
  const handleAddTopic = () => {
    if (currentTopic.trim()) {
        setTopicList(prev => [...prev, currentTopic.trim()]);
        setCurrentTopic('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    setTopicList(prev => prev.filter((_, i) => i !== index));
  };


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setQuizResult(null);
    setCurrentQuestionType(values.questionType);
    
    // Consolidate topics from the list if it's the active source
    const topics = topicList.length > 0 ? topicList.join(', ') : values.topics;
    if (!topics.trim()) {
        toast({
            variant: "destructive",
            title: "No Topics Provided",
            description: "Please enter at least one topic or paste some content.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const result = await createQuizAction({...values, topics });
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
                <Tabs defaultValue="paste" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upload">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                        </TabsTrigger>
                        <TabsTrigger value="list">
                            <List className="mr-2 h-4 w-4" />
                            List Topics
                        </TabsTrigger>
                        <TabsTrigger value="paste">
                            <File className="mr-2 h-4 w-4" />
                            Paste Content
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-4">
                        <Card className="border-dashed border-2 text-center h-48 flex flex-col justify-center items-center" >
                           <Upload className="h-8 w-8 text-muted-foreground mb-2"/>
                           <p className="font-medium">Feature coming soon!</p>
                           <p className="text-sm text-muted-foreground">Drag & drop or click to upload PDF/PPT</p>
                        </Card>
                    </TabsContent>
                    <TabsContent value="list" className="pt-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter a topic"
                                value={currentTopic}
                                onChange={(e) => setCurrentTopic(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddTopic(); }}}
                            />
                            <Button type="button" onClick={handleAddTopic}>
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </div>
                        {topicList.length > 0 && (
                             <div className="flex flex-wrap gap-2 mt-4">
                                {topicList.map((topic, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {topic}
                                        <button onClick={() => handleRemoveTopic(index)} className="rounded-full hover:bg-destructive/20 p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="paste" className="pt-4">
                         <FormField
                            control={form.control}
                            name="topics"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Textarea
                                    placeholder="Paste your notes, a chapter summary, or list key topics..."
                                    className="min-h-[150px]"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </TabsContent>
                </Tabs>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
