
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExamDetails } from '@/types';
import { useExam } from '@/context/ExamContext';


const onboardingSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  goal: z.string().min(3, "Please share your goal."),
  challenge: z.string().min(3, "Tell us about your challenge."),
  firstMove: z.string({ required_error: "Please select an option." }),
  examEve: z.string({ required_error: "Please select an option." }),
  studySession: z.string({ required_error: "Please select an option." }),
  superpower: z.string({ required_error: "Please select an option." }),
  achillesHeel: z.string({ required_error: "Please select an option." }),
  materialPref: z.string({ required_error: "Please select an option." }),
  referralSource: z.string({ required_error: "Please select an option." }),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: 'welcome', fields: [] as const },
  { id: 'name', title: "First, what should we call you?", fields: ['name'] as const },
  { id: 'goal', title: "What's your biggest academic goal right now?", fields: ['goal'] as const },
  { id: 'challenge', title: "What subject feels like your 'final boss' battle?", fields: ['challenge'] as const },
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
  { id: 'finish', fields: [] as const },
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { updateProfile } = useProfile();
  const { toast } = useToast();

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      goal: '',
      challenge: '',
    },
  });

  const { control, trigger, getValues, setValue } = form;

  const nextStep = async () => {
    const currentStepConfig = steps[currentStep];
    if (currentStepConfig && 'fields' in currentStepConfig && currentStepConfig.fields.length > 0) {
        const output = await trigger(currentStepConfig.fields, { shouldFocus: true });
        if (!output) return;
    }

    if (currentStep === steps.length - 1) {
        await handleSubmit();
    } else {
       setCurrentStep(step => step + 1);
    }
  };
  
  const prevStep = () => {
      if (currentStep > 0) {
          setCurrentStep(step => step - 1);
      }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const values = getValues();
    try {
        await updateProfile(values);
        toast({
            title: "Welcome to Wisdom!",
            description: "Your profile is set up. Let's start learning.",
        });
        router.push('/dashboard');
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Setup Failed",
            description: "Could not save your profile. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const progressValue = (currentStep / (steps.length - 2)) * 100;
  const currentStepConfig = steps[currentStep];

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {currentStep === 0 && (
            <div className="text-center">
              <h1 className="text-4xl font-headline font-bold mb-4">Welcome to Wisdom!</h1>
              <p className="text-lg text-muted-foreground mb-8">Let's get your profile set up with a few quick questions.</p>
              <Button onClick={nextStep} size="lg">Let's Go <ArrowRight className="ml-2" /></Button>
            </div>
          )}

          {currentStep > 0 && currentStep < steps.length - 1 && 'title' in currentStepConfig && (
              <div>
                  <h2 className="text-2xl font-headline font-semibold block text-center mb-8">{currentStepConfig.title}</h2>
                  {'options' in currentStepConfig ? (
                       <Controller
                          name={currentStepConfig.fields[0] as keyof OnboardingData}
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value) => {
                                  setValue(field.name, value);
                                  setTimeout(nextStep, 200);
                              }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto"
                            >
                              {currentStepConfig.options?.map(option => (
                                <Card
                                  key={option.value}
                                  className={cn(
                                    'cursor-pointer transition-all hover:border-primary/50',
                                    field.value === option.value && 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                                  )}
                                >
                                  <CardContent className="p-4">
                                     <Label htmlFor={option.value} className="flex items-center gap-4 cursor-pointer">
                                        <RadioGroupItem value={option.value} id={option.value} className="sr-only"/>
                                        <span className="font-medium">{option.label}</span>
                                      </Label>
                                  </CardContent>
                                </Card>
                              ))}
                            </RadioGroup>
                          )}
                        />
                  ) : (
                    <Controller
                        name={currentStepConfig.fields[0] as keyof OnboardingData}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Type your answer here..." className="max-w-md mx-auto text-center text-lg h-12" onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); nextStep(); }}}/>}
                    />
                  )}
              </div>
          )}
          
          {currentStep === steps.length -1 && (
            <div className="text-center">
              <h1 className="text-4xl font-headline font-bold mb-4">You're all set!</h1>
              <p className="text-lg text-muted-foreground mb-8">Ready to start your smarter learning journey?</p>
              <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  ) : (
                    <>
                      Go to Dashboard
                      <ArrowRight className="ml-2" />
                    </>
                  )}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <div className="flex items-center gap-4">
                <Button onClick={prevStep} variant="outline">Back</Button>
                <Progress value={progressValue} className="h-2 flex-1" />
                <Button onClick={nextStep} disabled={'options' in currentStepConfig}>
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
