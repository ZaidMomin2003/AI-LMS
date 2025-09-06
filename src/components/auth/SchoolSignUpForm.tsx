
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createSchoolAccountAction } from '@/app/becomepartner/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, School, Mail, Lock, Users, Building } from 'lucide-react';

const formSchema = z.object({
  schoolName: z.string().min(3, 'School name is required.'),
  adminEmail: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  schoolSize: z.coerce.number().min(1, 'School size must be at least 1.'),
});

type FormValues = z.infer<typeof formSchema>;

export function SchoolSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
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

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    // Create a FormData object to send to the server action
    const formData = new FormData();
    formData.append('schoolName', values.schoolName);
    formData.append('adminEmail', values.adminEmail);
    formData.append('password', values.password);
    formData.append('schoolSize', values.schoolSize.toString());

    const result = await createSchoolAccountAction(formData);
    
    if (result.success) {
      toast({
        title: 'Account Created!',
        description: 'Welcome! Redirecting you to your new school dashboard.',
      });
      router.push('/school/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: result.message,
      });
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full shadow-2xl shadow-primary/10 border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-2">
            <Building className="w-6 h-6" />
        </div>
        <CardTitle className="font-headline text-2xl">Create Your School Account</CardTitle>
        <CardDescription>Get started by setting up your institution's admin profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="e.g., Springfield University" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administrator Email</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="you@school.edu" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="Min. 8 characters" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="schoolSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Students (Licenses)</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account & Go to Dashboard
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
