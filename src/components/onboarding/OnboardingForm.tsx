
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProfile } from '@/context/ProfileContext';
import { useExam } from '@/context/ExamContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';

const instituteCodeSchema = z.object({
  institute: z.string().min(1, 'Please select your institute.'),
  instituteCode: z.string().optional(),
});

const onboardingSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.').optional().or(z.literal('')),
  country: z.string().min(2, 'Please enter a country.'),
  grade: z.string().min(2, 'Please enter your class or grade.'),
  examName: z.string().min(3, 'Please enter an exam name.'),
  examDate: z.date({ required_error: 'Please select an exam date.' }),
  referralSource: z.string({ required_error: 'Please select an option.' }),
}).and(instituteCodeSchema);

type OnboardingData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: 'welcome', fields: []},
  { id: 'phone', fields: ['phoneNumber'] },
  { id: 'country', fields: ['country'] },
  { id: 'grade', fields: ['grade'] },
  { id: 'institute', fields: ['institute', 'instituteCode'] },
  { id: 'exam', fields: ['examName', 'examDate'] },
  { id: 'referral', fields: ['referralSource'] },
  { id: 'finish', fields: [] },
] as const;


export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { updateProfile } = useProfile();
  const { addExam } = useExam();
  const { toast } = useToast();

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phoneNumber: '',
      country: '',
      grade: '',
      examName: '',
      referralSource: '',
      institute: '',
      instituteCode: '',
    },
  });

  const { control, trigger, getValues, setError, clearErrors } = form;
  
  const validateInstituteCode = () => {
    const { institute, instituteCode } = getValues();
    if (institute === "Zaid's Personal University" && instituteCode && instituteCode !== 'Zaid2003') {
        setError('instituteCode', { type: 'manual', message: 'Invalid institute code.' });
        return false;
    }
    clearErrors('instituteCode');
    return true;
  };


  const nextStep = async () => {
    const currentFields = steps[currentStep].fields;
    const output = await trigger(currentFields as any, { shouldFocus: true });
    
    if (!output) return;
    
    if (steps[currentStep].id === 'institute') {
        if (!validateInstituteCode()) return;
    }

    if (currentStep === steps.length - 2) { // The step before finish
        await handleSubmit();
    } else {
       setCurrentStep(step => step + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const values = getValues();

    if (!validateInstituteCode()) {
        setIsSubmitting(false);
        return;
    }

    try {
        const profileData = {
            phoneNumber: values.phoneNumber,
            country: values.country,
            grade: values.grade,
            referralSource: values.referralSource,
            institute: values.institute,
        };
        const examData = {
            name: values.examName,
            date: values.examDate.toISOString(),
            syllabus: `Syllabus for ${values.examName}`,
        };

        await Promise.all([
            updateProfile(profileData),
            addExam(examData)
        ]);
        
        const instituteCode = values.instituteCode?.trim();
        const discounted = instituteCode === 'Zaid2003';

        router.push(`/onboarding?step=subscribe&promo=${discounted}`);

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Setup Failed",
            description: "Could not save your profile. Please try again.",
        });
        setIsSubmitting(false);
    }
  };
  
  const progressValue = (currentStep / (steps.length - 2)) * 100;

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
              <h1 className="text-4xl font-headline font-bold mb-4">Welcome to Wisdomis Fun!</h1>
              <p className="text-lg text-muted-foreground mb-8">Let's get your profile set up with a few quick questions.</p>
              <Button onClick={nextStep} size="lg">Let's Go <ArrowRight className="ml-2" /></Button>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <label className="text-2xl font-headline font-semibold block text-center mb-6">What's your phone number? (Optional)</label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => <Input {...field} type="tel" placeholder="+1 (555) 123-4567" className="max-w-md mx-auto text-center text-lg h-12" />}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <label className="text-2xl font-headline font-semibold block text-center mb-6">Which country are you in?</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => <Input {...field} placeholder="e.g., United States" className="max-w-md mx-auto text-center text-lg h-12" />}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <label className="text-2xl font-headline font-semibold block text-center mb-6">What class or grade are you in?</label>
              <Controller
                name="grade"
                control={control}
                render={({ field }) => <Input {...field} placeholder="e.g., Grade 12 / University" className="max-w-md mx-auto text-center text-lg h-12" />}
              />
            </div>
          )}
          
          {currentStep === 4 && (
             <div className="space-y-6 max-w-md mx-auto">
                <label className="text-2xl font-headline font-semibold block text-center">Select your institute</label>
                <Controller
                    name="institute"
                    control={control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="text-lg h-12">
                            <SelectValue placeholder="Select an institute..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Zaid's Personal University">Zaid's Personal University</SelectItem>
                            <SelectItem value="Dummy University 1">Dummy University 1</SelectItem>
                            <SelectItem value="Dummy College 2">Dummy College 2</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
                 <Controller
                    name="instituteCode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div>
                            <Input {...field} placeholder="Institute Code (optional)" className="text-center text-lg h-12" />
                            {fieldState.error && <p className="text-destructive text-sm mt-2 text-center">{fieldState.error.message}</p>}
                        </div>
                    )}
                />
             </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 max-w-md mx-auto">
              <label className="text-2xl font-headline font-semibold block text-center">What's your next big exam?</label>
              <Controller
                name="examName"
                control={control}
                render={({ field }) => <Input {...field} placeholder="e.g., Final Chemistry Exam" className="text-center text-lg h-12" />}
              />
              <Controller
                name="examDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal text-lg h-12', !field.value && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP') : <span>Pick an exam date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <label className="text-2xl font-headline font-semibold block text-center mb-6">How did you hear about us?</label>
              <Controller
                name="referralSource"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="max-w-md mx-auto text-lg h-12">
                      <SelectValue placeholder="Select a source..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">X (Twitter)</SelectItem>
                      <SelectItem value="friend">Friend Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <div className="flex items-center gap-4">
                <Progress value={progressValue} className="h-2" />
                <Button onClick={nextStep} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <>OK <Check className="ml-2 w-4 h-4" /></>}
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
