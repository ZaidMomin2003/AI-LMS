
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';


const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters.'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordCard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    });

    const isEmailProvider = user?.providerData.some(p => p.providerId === 'password');

    const onSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
        if (!user || !user.email) return;
        setIsLoading(true);

        try {
            const credential = EmailAuthProvider.credential(user.email, data.oldPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, data.newPassword);

            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            form.reset();
        } catch (error: any) {
            let description = "An unexpected error occurred. Please try again.";
            if (error.code === 'auth/wrong-password') {
                description = "The old password you entered is incorrect.";
            }
            toast({ variant: 'destructive', title: "Update Failed", description });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isEmailProvider) {
        return null; // Don't render this card for Google/other social sign-ins
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Change your account password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Change Password
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
