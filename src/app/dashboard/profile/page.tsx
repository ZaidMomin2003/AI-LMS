'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useExam } from '@/context/ExamContext';
import { useProfile } from '@/context/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
    const { user } = useAuth();
    const { exam } = useExam();
    const { profile, loading: profileLoading } = useProfile();

    const ProfileInput = ({ id, label, value, loading, ...props }: { id: string; label: string; value: string; loading: boolean; [key: string]: any; }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {loading ? <Skeleton className="h-10 w-full" /> : <Input id={id} value={value} readOnly {...props} />}
        </div>
    );
    
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
                            <ProfileInput id="name" label="Full Name" value={user?.displayName || 'Test User'} loading={profileLoading} />
                            <ProfileInput id="email" label="Email Address" type="email" value={user?.email || 'test@example.com'} loading={profileLoading} />
                            <ProfileInput id="phone" label="Phone Number" type="tel" value={profile?.phoneNumber || 'Not Set'} loading={profileLoading} />
                            <ProfileInput id="country" label="Country" value={profile?.country || 'Not Set'} loading={profileLoading} />
                            <ProfileInput id="class" label="Class/Grade" value={profile?.grade || 'Not Set'} loading={profileLoading} />
                            <ProfileInput id="exam" label="Target Exam" value={exam?.name || 'Not Set'} loading={profileLoading} />
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
