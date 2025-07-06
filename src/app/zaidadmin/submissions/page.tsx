
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Dummy Data for contact form submissions
const dummySubmissions = [
  { name: 'Alex Johnson', email: 'alex.j@example.com', message: "I'm having trouble with the quiz feature. It doesn't seem to be saving my score. Can you help?", date: '2023-11-21' },
  { name: 'Sofia Davis', email: 'sofia.d@example.com', message: 'Just wanted to say I love the app! The flashcards are a lifesaver. Any plans to add an iOS app?', date: '2023-11-20' },
  { name: 'Chen Wei', email: 'chen.w@example.com', message: 'Inquiry about enterprise plans. We are a team of 50 and would like to know about bulk licensing.', date: '2023-11-20' },
  { name: 'Maria Garcia', email: 'maria.g@example.com', message: "There's a typo in the Renaissance study notes. 'Michelangelo' is spelled incorrectly.", date: '2023-11-19' },
  { name: 'David Smith', email: 'david.s@example.com', message: 'My password reset link is not working. I have tried multiple times.', date: '2023-11-18' },
];

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
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Contact Submissions</h2>
        <Button onClick={() => handleExport(dummySubmissions, 'contact_submissions')}>
          <Download className="mr-2 h-4 w-4" />
          Export Submissions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Messages from the landing page contact form.</CardDescription>
        </CardHeader>
        <CardContent>
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
                        {dummySubmissions.map(submission => (
                            <TableRow key={submission.email}>
                                <TableCell>
                                    <div className="font-medium">{submission.name}</div>
                                    <div className="text-xs text-muted-foreground">{submission.email}</div>
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-lg truncate">{submission.message}</p>
                                </TableCell>
                                <TableCell className="text-right">{submission.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
