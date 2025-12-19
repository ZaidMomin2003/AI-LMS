
'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useExam } from '@/context/ExamContext';
import { useProfile } from '@/context/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon, RefreshCcw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ExamDetails } from '@/types';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  grade: z.string().optional(),
  examName: z.string().min(3, 'Exam name must be at least 3 characters.'),
  examDate: z.date({ required_error: 'Please select an exam date.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user } = useAuth();
    const { exam, addExam, loading: examLoading } = useExam();
    const { profile, updateProfile, loading: profileLoading } = useProfile();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    const { register, handleSubmit, formState: { isSubmitting, isDirty }, reset, control } = form;

    useEffect(() => {
        if (profile || exam) {
            reset({
                phoneNumber: profile?.phoneNumber || '',
                country: profile?.country || '',
                grade: profile?.grade || '',
                examName: exam?.name || '',
                examDate: exam?.date ? new Date(exam.date) : new Date(),
            });
        }
    }, [profile, exam, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateProfile({
                phoneNumber: data.phoneNumber,
                country: data.country,
                grade: data.grade,
            });
            const examData: ExamDetails = {
                name: data.examName,
                date: data.examDate.toISOString(),
            };
            await addExam(examData);
            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });
            reset(data); // Resets form's dirty state
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not save your changes. Please try again.',
            });
        }
    };
    
    const handleRestartOnboarding = async () => {
        try {
            // Clear a field that indicates onboarding is complete
            await updateProfile({ referralSource: '' });
            toast({
                title: "Let's start over!",
                description: "Redirecting you to the onboarding process."
            });
            router.push('/onboarding');
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Failed to restart',
                description: 'Could not restart the onboarding process. Please try again.',
            });
        }
    };
    
    const isLoading = profileLoading || examLoading;

    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">My Profile</h2>
                    <p className="text-muted-foreground">View and manage your account details.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Your name and email are managed by your Google account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={user?.displayName || 'Test User'} readOnly className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={user?.email || 'test@example.com'} readOnly className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" {...register('phoneNumber')} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" {...register('country')} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="class">Class/Grade</Label>
                                        <Input id="class" {...register('grade')} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="examName">Target Exam Name</Label>
                                        <Input id="examName" {...register('examName')} className="mt-2" />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label>Target Exam Date</Label>
                                        <Controller
                                            name="examDate"
                                            control={control}
                                            render={({ field }) => (
                                              <Popover>
                                                <PopoverTrigger asChild>
                                                  <Button variant="outline" className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                  </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                                                </PopoverContent>
                                              </Popover>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Label>Restart Onboarding</Label>
                                        <Button onClick={handleRestartOnboarding} variant="outline" className="w-full mt-2">
                                            <RefreshCcw className="mr-2 h-4 w-4"/>
                                            Restart Onboarding
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting || !isDirty || isLoading}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
