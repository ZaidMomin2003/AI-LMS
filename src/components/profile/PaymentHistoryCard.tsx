
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { getUserDoc } from '@/services/firestore';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';

interface Payment {
    orderId: string;
    paymentId: string;
    plan: string;
    expiryDate: string;
}

export function PaymentHistoryCard() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            if (user) {
                // In a real app, you'd fetch this from a 'payments' subcollection.
                // For this demo, we'll check the subscription object on the user doc.
                const userData = await getUserDoc(user.uid);
                if (userData?.subscription) {
                    setPayments([userData.subscription as Payment]);
                }
            }
            setIsLoading(false);
        };
        fetchPayments();
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                    A record of your subscriptions and payments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : payments.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plan</TableHead>
                                <TableHead>Payment ID</TableHead>
                                <TableHead className="text-right">Access Expires</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.paymentId}>
                                    <TableCell className="font-medium">{payment.plan}</TableCell>
                                    <TableCell className="text-muted-foreground">{payment.paymentId}</TableCell>
                                    <TableCell className="text-right">{format(new Date(payment.expiryDate), 'PPP')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        You have no payment history.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
