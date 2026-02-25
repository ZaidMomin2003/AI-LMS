
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
import { ChangePasswordCard } from '@/components/profile/ChangePasswordCard';
import { DeleteAccountCard } from '@/components/profile/DeleteAccountCard';

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
            <div className="flex-1 relative overflow-hidden bg-background">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

                <div className="relative z-10 p-4 md:p-8 pt-6 max-w-5xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter leading-none">
                            My <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Profile</span>
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium opacity-70">
                            Configure your digital identity and academic parameters.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                                            <CalendarIcon size={20} />
                                        </div>
                                        <CardTitle className="font-black text-2xl tracking-tighter uppercase opacity-80">Personal Information</CardTitle>
                                    </div>
                                    <CardDescription className="font-medium opacity-60">
                                        Core identity details synchronized via secure synthesis.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 pt-4">
                                    {isLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Full Name</Label>
                                                <Input id="name" value={user?.displayName || ''} readOnly className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold opacity-70" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Email Address</Label>
                                                <Input id="email" type="email" value={user?.email || ''} readOnly className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold opacity-70" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Phone Number</Label>
                                                <Input id="phone" type="tel" {...register('phoneNumber')} className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Country</Label>
                                                <Input id="country" {...register('country')} className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="class" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Class/Grade</Label>
                                                <Input id="class" {...register('grade')} className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="examName" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Target Exam Name</Label>
                                                <Input id="examName" {...register('examName')} className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all" />
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Target Exam Date</Label>
                                                <Controller
                                                    name="examDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" className={cn('bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold justify-between text-left transition-all hover:bg-background/40 hover:border-border/20', !field.value && 'text-muted-foreground/30')}>
                                                                    {field.value ? format(field.value, 'MMMM do, yyyy') : <span>Select date</span>}
                                                                    <CalendarIcon className="h-4 w-4 opacity-40 text-primary" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 rounded-3xl border-border/10 bg-background/95 backdrop-blur-3xl shadow-3xl">
                                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className="p-3" />
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">System Reset</Label>
                                                <Button type="button" onClick={handleRestartOnboarding} variant="outline" className="w-full bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold hover:bg-primary/5 hover:border-primary/20 transition-all">
                                                    <RefreshCcw className="mr-2 h-4 w-4 text-primary" />
                                                    Restart Onboarding
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-4 border-t border-border/5">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !isDirty || isLoading}
                                            className="h-12 px-8 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Synchronize Identity'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ChangePasswordCard />
                            <DeleteAccountCard />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
