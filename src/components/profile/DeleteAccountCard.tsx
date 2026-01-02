
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { deleteUser } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteAccountCard() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDelete = async () => {
        if (!user) return;
        setIsDeleting(true);
        try {
            await deleteUser(user);
            toast({ title: "Account Deleted", description: "Your account has been successfully deleted." });
            router.push('/');
        } catch (error: any) {
            let description = "An error occurred. Please try again. You may need to sign in again to perform this action.";
            if (error.code === 'auth/requires-recent-login') {
                description = "This is a sensitive action. Please sign out and sign in again before deleting your account.";
            }
            toast({ variant: "destructive", title: "Deletion Failed", description });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                    This action is permanent and cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete My Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete your account and all associated data, including your notes, quizzes, and study plans. To confirm, please type <strong>DELETE</strong> in the box below.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input
                            placeholder="Type DELETE to confirm"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={confirmationText !== 'DELETE' || isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}

