
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createSchoolAccountAction } from '@/app/becomepartner/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, School, Mail, Lock, Users } from 'lucide-react';
import { signInWithPopup, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const formSchema = z.object({
  schoolName: z.string().min(3, 'School name is required.'),
  adminEmail: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  schoolSize: z.coerce.number().min(1, 'School size must be at least 1.'),
});

const googleFormSchema = formSchema.omit({ adminEmail: true, password: true });

type FormValues = z.infer<typeof formSchema>;
type GoogleFormValues = z.infer<typeof googleFormSchema>;

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.06,4.71c2.04-3.46,5.72-6,9.63-6c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export function SchoolSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      adminEmail: '',
      password: '',
      schoolSize: 100,
    },
  });

  const googleForm = useForm<GoogleFormValues>({
      resolver: zodResolver(googleFormSchema),
      defaultValues: {
          schoolName: '',
          schoolSize: 100,
      }
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const result = await createSchoolAccountAction(values);
    if (result.success) {
      toast({ title: 'Account Created!', description: 'Redirecting to your school dashboard.' });
      router.push('/school/dashboard');
    } else {
      toast({ variant: 'destructive', title: 'Sign-up Failed', description: result.message });
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!auth || !googleProvider) return;
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setGoogleUser(result.user);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function onGoogleSubmit(values: GoogleFormValues) {
    if (!googleUser || !googleUser.email) return;
    setIsLoading(true);

    const result = await createSchoolAccountAction({
        ...values,
        adminEmail: googleUser.email,
        password: '', // Password is not needed for Google sign-up
    });

    if (result.success) {
        toast({ title: 'Account Created!', description: 'Redirecting to your school dashboard.' });
        router.push('/school/dashboard');
    } else {
        toast({ variant: 'destructive', title: 'Sign-up Failed', description: result.message });
        setIsLoading(false);
        setGoogleUser(null);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="schoolName" render={({ field }) => (
              <FormItem><FormLabel>School Name</FormLabel><FormControl><div className="relative"><School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="e.g., Springfield University" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="adminEmail" render={({ field }) => (
              <FormItem><FormLabel>Administrator Email</FormLabel><FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="you@school.edu" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Min. 8 characters" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="schoolSize" render={({ field }) => (
              <FormItem><FormLabel>Number of Students (Licenses)</FormLabel><FormControl><div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="number" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )}/>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Account with Email
          </Button>
        </form>
      </Form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />} Sign up with Google
      </Button>

      <Dialog open={!!googleUser} onOpenChange={(open) => !open && setGoogleUser(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Complete Your School Profile</DialogTitle>
                <DialogDescription>
                    You're signed in as {googleUser?.email}. Just a few more details to create your school account.
                </DialogDescription>
            </DialogHeader>
             <Form {...googleForm}>
                <form onSubmit={googleForm.handleSubmit(onGoogleSubmit)} className="space-y-4 py-4">
                    <FormField control={googleForm.control} name="schoolName" render={({ field }) => (
                        <FormItem><FormLabel>School Name</FormLabel><FormControl><div className="relative"><School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="e.g., Springfield University" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={googleForm.control} name="schoolSize" render={({ field }) => (
                        <FormItem><FormLabel>Number of Students (Licenses)</FormLabel><FormControl><div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="number" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Complete Registration
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
