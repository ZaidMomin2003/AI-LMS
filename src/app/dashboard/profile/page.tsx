'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useExam } from '@/context/ExamContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const { exam } = useExam();

    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        My Profile
                    </h2>
                    <p className="text-muted-foreground">
                        View and manage your account details.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            This is the information associated with your account. Editing will be available soon.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={user?.displayName || 'Test User'} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={user?.email || 'test@example.com'} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" value="+1 123-456-7890" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" value="United States" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Class/Grade</Label>
                                <Input id="class" value="Grade 12" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exam">Target Exam</Label>
                                <Input id="exam" value={exam?.name || 'Not Set'} readOnly />
                            </div>
                        </div>
                         <div className="flex justify-end pt-4">
                            <Button disabled>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
