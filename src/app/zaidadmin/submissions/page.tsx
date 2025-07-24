'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { fetchSubmissions, type Submission } from './actions';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';


const handleExport = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getSubmissions = async () => {
        setIsLoading(true);
        const data = await fetchSubmissions();
        setSubmissions(data);
        setIsLoading(false);
    };
    getSubmissions();
  }, []);

  const handleRowClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };
  
  const TableSkeleton = () => (
     <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[250px]"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
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
                        <TableCell>
                            <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell className="text-right">
                           <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Contact Submissions</h2>
        <Button onClick={() => handleExport(submissions, 'contact_submissions')} disabled={submissions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Submissions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Messages from the landing page contact form. Click a row to view the full message.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <TableSkeleton />
            ) : submissions.length > 0 ? (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">From</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="w-[150px] text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map(submission => (
                                    <TableRow key={submission.id} onClick={() => handleRowClick(submission)} className="cursor-pointer">
                                        <TableCell>
                                            <div className="font-medium">{submission.name}</div>
                                            <div className="text-xs text-muted-foreground">{submission.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="max-w-lg truncate">{submission.message}</p>
                                        </TableCell>
                                        <TableCell className="text-right">{format(new Date(submission.createdAt), 'PP')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No contact submissions yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>Submission from: {selectedSubmission.name}</DialogTitle>
                <DialogDescription>
                  {selectedSubmission.email} &bull; Received on {format(new Date(selectedSubmission.createdAt), 'PPP p')}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 bg-secondary/50 rounded-md px-4 my-4">
                 <p className="whitespace-pre-wrap text-sm text-foreground">{selectedSubmission.message}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
