
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
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';


const personalizationSchema = z.object({
  studying: z.string().min(2, 'Please specify what you are studying.'),
  aiName: z.string().min(2, 'Please enter a name.'),
  educationLevel: z.string().min(3, 'Please specify your education level.'),
  contentStyle: z.string({ required_error: 'Please select a style.' }),
  goal: z.string({ required_error: 'Please select a goal.' }),
  challenge: z.string().min(3, 'Tell us about your biggest challenge.'),
  firstMove: z.string({ required_error: "Please select an option." }),
  examEve: z.string({ required_error: "Please select an option." }),
  studySession: z.string({ required_error: "Please select an option." }),
  superpower: z.string({ required_error: "Please select an option." }),
  achillesHeel: z.string({ required_error: "Please select an option." }),
  materialPref: z.string({ required_error: "Please select an option." }),
  referralSource: z.string({ required_error: "Please select an option." }),
});

type FormValues = z.infer<typeof personalizationSchema>;

const questionGroups = [
    {
      id: 'goal',
      title: "What's your biggest academic goal right now?",
      fields: ['goal'] as const,
      options: [
        { value: 'ace-exams', label: 'Ace my exams' },
        { value: 'improve-grades', label: 'Improve my grades' },
        { value: 'university-prep', label: 'Prepare for university entrance exams' },
        { value: 'learn-new-skill', label: 'Learn a new skill for my career' },
      ],
    },
    {
      id: 'challenge',
      title: "What subject feels like your 'final boss' battle?",
      fields: ['challenge'] as const,
    },
    {
      id: 'firstMove',
      title: "When a new topic is introduced, what’s your first move?",
      fields: ['firstMove'] as const,
      options: [
          { value: 'practice', label: 'Jump straight into practice problems.' },
          { value: 'read', label: 'Read the textbook chapter from start to finish.' },
          { value: 'watch', label: 'Find a video or lecture that explains it.' },
          { value: 'connect', label: 'Try to connect it to what I already know.' },
      ],
    },
    {
      id: 'examEve',
      title: "It's the night before a big exam. What's your status?",
      fields: ['examEve'] as const,
      options: [
          { value: 'confident', label: 'Confident and doing a final, light review.' },
          { value: 'anxious', label: 'Calm on the outside, panicking on the inside.' },
          { value: 'cramming', label: 'Fueled by caffeine and cramming furiously.' },
          { value: 'winging-it', label: "I'll just wing it tomorrow." },
      ]
    },
    {
        id: 'studySession',
        title: "Which of these sounds like the most epic study session?",
        fields: ['studySession'] as const,
        options: [
            { value: 'solo', label: 'A quiet library, completely alone with my books.' },
            { value: 'group', label: 'A collaborative session, bouncing ideas off friends.' },
            { value: 'cafe', label: 'A cozy cafe with background music and a good latte.' },
            { value: 'virtual', label: 'A virtual session with online tools and resources.' },
        ]
    },
    {
        id: 'superpower',
        title: "If you could have one study superpower, what would it be?",
        fields: ['superpower'] as const,
        options: [
            { value: 'photographic-memory', label: 'Photographic memory.' },
            { value: 'instant-understanding', label: 'The ability to instantly understand complex concepts.' },
            { value: 'laser-focus', label: 'Laser focus that blocks all distractions.' },
            { value: 'predict-questions', label: 'The ability to predict exam questions.' },
        ]
    },
    {
        id: 'achillesHeel',
        title: "What's your learning Achilles' heel?",
        fields: ['achillesHeel'] as const,
        options: [
            { value: 'distraction', label: "Getting easily distracted by my phone or other tabs." },
            { value: 'procrastination', label: 'Procrastinating until the very last minute.' },
            { value: 'forgetting', label: 'Forgetting information shortly after learning it.' },
            { value: 'overthinking', label: 'Getting stuck on small details and losing the big picture.' },
        ]
    },
    {
        id: 'materialPref',
        title: "How do you prefer your study materials?",
        fields: ['materialPref'] as const,
        options: [
            { value: 'visual', label: 'Visual and colorful, with diagrams and charts.' },
            { value: 'concise', label: 'Straight to the point: bullet lists and concise summaries.' },
            { value: 'interactive', label: 'Interactive, with quizzes and things I can click on.' },
            { value: 'mixed', label: 'A mix of everything, please!' },
        ]
    },
    {
        id: 'referral',
        title: "Finally, where did you hear about us?",
        fields: ['referralSource'] as const,
        options: [
            { value: 'youtube', label: 'YouTube' },
            { value: 'instagram', label: 'Instagram / Facebook' },
            { value: 'friend', label: 'A friend or teacher' },
            { value: 'search', label: 'App Store / Google Search' },
            { value: 'other', label: 'Other' },
        ]
    },
];


const PersonalizationForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      studying: '',
      aiName: '',
      educationLevel: '',
      contentStyle: '',
      goal: '',
      challenge: '',
      firstMove: '',
      examEve: '',
      studySession: '',
      superpower: '',
      achillesHeel: '',
      materialPref: '',
      referralSource: '',
    },
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4 text-lg">
                <span className="font-medium">I am studying</span>
                <FormField
                    control={form.control}
                    name="studying"
                    render={({ field }) => (
                        <FormItem className="inline-flex">
                            <FormControl>
                                <Input placeholder="e.g., Middle School" {...field} className="h-9 text-lg min-w-[150px] w-auto inline-block" />
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

            {questionGroups.map((group) => (
              <div key={group.id} className="space-y-4">
                <h3 className="text-lg font-semibold">{group.title}</h3>
                <Controller
                  name={group.fields[0]}
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {group.options.map(option => (
                        <Card
                          key={option.value}
                          className={cn(
                            'cursor-pointer transition-all hover:border-primary/50',
                            field.value === option.value && 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                          )}
                        >
                          <CardContent className="p-4">
                              <Label htmlFor={option.value} className="flex items-center gap-4 cursor-pointer">
                                <RadioGroupItem value={option.value} id={option.value}/>
                                <span className="font-medium">{option.label}</span>
                              </Label>
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  )}
                />
                <FormMessage />
              </div>
            ))}

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
