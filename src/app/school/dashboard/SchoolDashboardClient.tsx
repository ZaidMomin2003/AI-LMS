
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Trash2, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import type { SchoolData, SchoolUser } from './actions';
import { removeUserFromSchool } from './actions';
import { useToast } from '@/hooks/use-toast';
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
} from "@/components/ui/alert-dialog";

interface SchoolDashboardClientProps {
  initialSchool: SchoolData;
  initialUsers: SchoolUser[];
}

export function SchoolDashboardClient({ initialSchool, initialUsers }: SchoolDashboardClientProps) {
  const [school, setSchool] = useState(initialSchool);
  const [users, setUsers] = useState(initialUsers);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const copyInviteCode = () => {
    navigator.clipboard.writeText(school.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  const handleRemoveUser = async (userId: string) => {
    setIsDeleting(userId);
    const result = await removeUserFromSchool(userId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      // Refresh data by removing user and updating license count
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSchool(prev => ({ ...prev, usedLicenses: Math.max(0, prev.usedLicenses - 1) }));
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
    setIsDeleting(null);
  }

  const licenseUsagePercent = (school.usedLicenses / school.totalLicenses) * 100;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>License Usage</CardTitle>
            <CardDescription>Track your available student licenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{school.usedLicenses} / {school.totalLicenses}</div>
            <p className="text-xs text-muted-foreground">used licenses</p>
            <Progress value={licenseUsagePercent} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invite Code</CardTitle>
            <CardDescription>Share this code with your students to sign up.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
              <p className="text-2xl font-mono font-bold flex-1">{school.inviteCode}</p>
              <Button onClick={copyInviteCode} size="icon" variant="ghost">
                {copiedCode ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Licensed Students</CardTitle>
          <CardDescription>A list of all students who have signed up with your invite code.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.displayName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" disabled={!!isDeleting}>
                                    {isDeleting === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will remove the student from your school and free up their license. They will lose Pro access. This cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Yes, remove student
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No students have signed up yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
