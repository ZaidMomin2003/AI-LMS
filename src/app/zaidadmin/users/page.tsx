
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dummy Data
const allUsers = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', country: 'USA', plan: 'Scholar', signUpDate: '2023-11-20' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', country: 'Canada', plan: 'Free', signUpDate: '2023-11-19' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', country: 'UK', plan: 'Sage Mode', signUpDate: '2023-11-18' },
  { name: 'William Kim', email: 'will@email.com', country: 'Australia', plan: 'Scholar', signUpDate: '2023-11-17' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', country: 'USA', plan: 'Free', signUpDate: '2023-11-16' },
  { name: 'Liam Garcia', email: 'liam.g@email.com', country: 'Spain', plan: 'Free', signUpDate: '2023-11-15' },
  { name: 'Ava Rodriguez', email: 'ava.r@email.com', country: 'Mexico', plan: 'Scholar', signUpDate: '2023-11-14' },
  { name: 'Noah Martinez', email: 'noah.m@email.com', country: 'USA', plan: 'Sage Mode', signUpDate: '2023-11-13' },
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


export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Users Management</h2>
        <Button onClick={() => handleExport(allUsers, 'all_users')}>
          <Download className="mr-2 h-4 w-4" />
          Export All Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users by name or email..." className="pl-8"/>
                </div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by plan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="scholar">Scholar</SelectItem>
                        <SelectItem value="sage">Sage Mode</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Sign-up Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allUsers.map(user => (
                    <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>
                            <Badge variant={user.plan === 'Free' ? 'secondary' : (user.plan === 'Sage Mode' ? 'destructive' : 'default')}>{user.plan}</Badge>
                        </TableCell>
                        <TableCell>{user.signUpDate}</TableCell>
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
