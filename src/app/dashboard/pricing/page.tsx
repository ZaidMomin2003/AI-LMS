'use client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Lock, Star, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Plan {
    name: string;
    price: number;
    priceDescription: string;
    durationMonths: number;
}

const sagePlan: Plan = {
    name: 'Sage', 
    price: 199, 
    priceDescription: 'for 12 months of access',
    durationMonths: 12, 
};

const PricingContent = () => {
    const { user } = useAuth();
    const { subscription, loading: subLoading } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            toast({
                title: "Payment Successful!",
                description: "Your subscription has been activated. Welcome to Pro!",
            });
        }
        if (searchParams.get('success') === 'false') {
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: "Something went wrong with your payment. Please try again.",
            });
        }
    }, [searchParams, toast]);

    const handlePayment = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'You must be logged in to subscribe.' });
            return;
        }

        setIsLoading(true);

        try {
            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: sagePlan.price, userId: user.uid }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                // This will now display the specific error from the server
                throw new Error(orderData.error || 'Could not create a payment order.');
            }
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Wisdom Pro',
                description: `Subscription for ${sagePlan.name} plan`,
                order_id: orderData.id,
                handler: function (response: any) {
                    const data = new URLSearchParams();
                    data.append('razorpay_payment_id', response.razorpay_payment_id);
                    data.append('razorpay_order_id', response.razorpay_order_id);
                    data.append('razorpay_signature', response.razorpay_signature);
                    data.append('plan_duration', sagePlan.durationMonths.toString());
                    
                    // Use a form submission to redirect, which works better with server-side redirects
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = '/api/payment-verification';

                    for (const key of data.keys()) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = data.get(key)!;
                        form.appendChild(input);
                    }
                    document.body.appendChild(form);
                    form.submit();
                },
                prefill: {
                    name: user.displayName || 'New User',
                    email: user.email || '',
                },
                theme: {
                    color: '#4B0082', 
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const currencySymbol = '$';

    const sageFeatures = [
        'Unlimited Topic Generations',
        'Unlimited Study Roadmaps',
        'Unlimited Pomodoro Timers',
        'Unlimited Capture Tool',
        'WisdomGPT AI Assistant',
        'Priority Email Support',
    ];

    return (
        <AppLayout>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">Unlock Your Full Potential</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Get unlimited access to all AI-powered tools with our one-year plan.
                    </p>
                </div>
                <div className="flex justify-center pt-8">
                    <Card className="flex flex-col h-full max-w-md w-full border-primary ring-2 ring-primary shadow-2xl shadow-primary/20">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">{sagePlan.name}</CardTitle>
                            <CardDescription className="flex flex-col">
                                <span className="text-4xl font-bold text-foreground">{currencySymbol}{sagePlan.price}</span>
                                <span className="text-muted-foreground text-sm mt-1">{sagePlan.priceDescription}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                            <ul className="space-y-3">
                                {sageFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handlePayment}
                                disabled={subLoading || isLoading || subscription?.status === 'active'}
                            >
                                {isLoading ? 'Processing...' : (subscription?.status === 'active') ? 'Your Current Plan' : 'Get Sage Plan'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default function PricingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PricingContent />
        </Suspense>
    )
}
