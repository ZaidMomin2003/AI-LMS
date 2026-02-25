
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { fetchSupportRequests, type SupportRequest } from './actions';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const handleExport = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getRequests = async () => {
        setIsLoading(true);
        const data = await fetchSupportRequests();
        setRequests(data);
        setIsLoading(false);
    };
    getRequests();
  }, []);

  const handleRowClick = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };
  
  const TableSkeleton = () => (
     <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead className="w-[150px]"><Skeleton className="h-4 w-20" /></TableHead>
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
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
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
        <h2 className="text-3xl font-bold tracking-tight font-headline">Support Requests</h2>
        <Button onClick={() => handleExport(requests, 'support_requests')} disabled={requests.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Requests
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Support requests from users. Click a row to view the full message.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <TableSkeleton />
            ) : requests.length > 0 ? (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">From</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="w-[150px]">Query Type</TableHead>
                                    <TableHead className="w-[150px] text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map(request => (
                                    <TableRow key={request.id} onClick={() => handleRowClick(request)} className="cursor-pointer">
                                        <TableCell>
                                            <div className="font-medium">{request.name}</div>
                                            <div className="text-xs text-muted-foreground">{request.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="max-w-md truncate">{request.message}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{request.queryType}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{format(new Date(request.createdAt), 'PP')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No support requests yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Request from: {selectedRequest.name}</DialogTitle>
                <DialogDescription>
                  {selectedRequest.email} &bull; Received on {format(new Date(selectedRequest.createdAt), 'PPP p')}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Query:</span>
                <Badge variant="outline">{selectedRequest.queryType}</Badge>
              </div>
              <div className="py-4 bg-secondary/50 rounded-md px-4 my-2">
                 <p className="whitespace-pre-wrap text-sm text-foreground">{selectedRequest.message}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
