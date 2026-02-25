
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Payment {
    orderId: string;
    plan: string;
    originalAmount: number;
    currency: string;
    createdAt: string;
    expiryDate: string;
}

export function PaymentHistoryCard() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            if (user && db) {
                try {
                    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const userPayments: Payment[] = [];
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        // Get subscription details from user doc to find expiry
                        // In a real app this might be stored on the order doc itself
                        // For now, we'll assume expiry is tied to the current user sub.
                        // This part is complex, for now we will show what we have.
                        userPayments.push({
                            orderId: doc.id,
                            plan: 'Sage Mode', // This is a placeholder, a real app would store this on the order
                            originalAmount: data.originalAmount,
                            currency: data.currency,
                            createdAt: data.createdAt,
                            expiryDate: 'N/A' // This data is on the user doc, not order doc.
                        });
                    });
                     // Let's also check the subscription object for the latest one
                    const userDoc = await(await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)))).docs[0]?.data();
                    if (userDoc?.subscription) {
                        const sub = userDoc.subscription;
                        const existingPayment = userPayments.find(p => p.orderId === sub.orderId);
                        if (!existingPayment && sub.orderId) {
                            userPayments.push({
                                orderId: sub.orderId,
                                plan: sub.plan,
                                originalAmount: 0, // Not available on sub object
                                currency: 'USD',
                                createdAt: sub.createdAt || new Date().toISOString(),
                                expiryDate: sub.expiryDate
                            })
                        } else if(existingPayment) {
                            // update existing payment with more accurate data from subscription
                             existingPayment.plan = sub.plan;
                             existingPayment.expiryDate = sub.expiryDate;
                        }
                    }

                    setPayments(userPayments.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                } catch(error) {
                    console.error("Error fetching payment history:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
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
                                <TableHead>Product</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Access Expires</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.orderId}>
                                    <TableCell className="font-medium">{payment.plan}</TableCell>
                                    <TableCell>{payment.originalAmount ? `$${payment.originalAmount.toFixed(2)} ${payment.currency}`: 'N/A'}</TableCell>
                                    <TableCell>{format(new Date(payment.createdAt), 'PP')}</TableCell>
                                    <TableCell className="text-right">{payment.expiryDate !== 'N/A' ? format(new Date(payment.expiryDate), 'PP') : 'N/A'}</TableCell>
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
