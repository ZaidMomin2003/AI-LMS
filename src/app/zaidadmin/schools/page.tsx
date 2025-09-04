
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, PlusCircle, Copy, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { fetchSchools, createSchool, type School, type NewSchoolData } from './actions';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters.'),
  adminEmail: z.string().email('Please enter a valid email address.'),
  totalLicenses: z.coerce.number().min(1, 'At least one license is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', adminEmail: '', totalLicenses: 100 },
  });

  const getSchools = async () => {
    setIsLoading(true);
    const data = await fetchSchools();
    setSchools(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getSchools();
  }, []);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await createSchool(values);
    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      form.reset();
      setIsFormOpen(false);
      await getSchools(); // Refresh the list
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  }
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const TableSkeleton = () => (
     <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[250px]"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead className="w-[150px]"><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead className="w-[150px] text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">School Licensing</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New School
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Partner School</DialogTitle>
                    <DialogDescription>
                        Fill out the details to generate an invite code and licenses for a new school.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>School Name</FormLabel><FormControl><Input placeholder="e.g., Springfield High" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="adminEmail" render={({ field }) => (
                            <FormItem><FormLabel>Administrator Email</FormLabel><FormControl><Input placeholder="principal@springfield.edu" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="totalLicenses" render={({ field }) => (
                            <FormItem><FormLabel>Number of Licenses</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create School
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Schools</CardTitle>
          <CardDescription>All schools with active license plans.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <TableSkeleton />
            ) : schools.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">School</TableHead>
                                <TableHead>License Usage</TableHead>
                                <TableHead>Invite Code</TableHead>
                                <TableHead className="w-[150px] text-right">Date Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schools.map(school => (
                                <TableRow key={school.id}>
                                    <TableCell>
                                        <div className="font-medium">{school.name}</div>
                                        <div className="text-xs text-muted-foreground">{school.adminEmail}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={(school.usedLicenses / school.totalLicenses) * 100} className="w-24" />
                                            <span className="text-xs text-muted-foreground">{school.usedLicenses} / {school.totalLicenses}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm">{school.inviteCode}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(school.inviteCode)}>
                                                {copiedCode === school.inviteCode ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{format(new Date(school.createdAt), 'PP')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No schools have been added yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
