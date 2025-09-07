
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Trash2, Loader2, Users, FileText, MoreVertical, Receipt } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSchool(prev => ({ ...prev, usedLicenses: Math.max(0, prev.usedLicenses - 1) }));
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
    setIsDeleting(null);
  }

  const remainingLicenses = school.totalLicenses - school.usedLicenses;
  // This is a placeholder as we don't track this yet.
  const totalNotesGenerated = users.length * 15; 

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.usedLicenses} / {school.totalLicenses}</div>
            <p className="text-xs text-muted-foreground">Total licensed students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Licenses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingLicenses}</div>
            <p className="text-xs text-muted-foreground">Available for new students</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~{totalNotesGenerated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all students (est.)</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Licenses</CardTitle>
                 <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <p className="text-xs text-muted-foreground mb-3">Need more seats for your students?</p>
                 <Button onClick={() => router.push('/school/dashboard/licenses')} className="w-full">
                    Purchase Licenses
                 </Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Licensed Students</CardTitle>
          <CardDescription>A list of all students who have signed up with your invite code: <span className="font-mono font-bold">{school.inviteCode}</span></CardDescription>
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
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem disabled>View Details (soon)</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                            Remove Student
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will remove the student from your school and free up their license. They will lose Pro access. This cannot be undone.
                                        </d:AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemoveUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            {isDeleting === user.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Yes, remove student
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
