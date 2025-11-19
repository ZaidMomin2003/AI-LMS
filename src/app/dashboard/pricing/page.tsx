'use client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useState, Suspense, useEffect } from 'react';
import { createOrder } from './actions';
import { useSearchParams } from 'next/navigation';

interface Plan {
    name: string;
    price: number;
    durationMonths: number;
    features: string[];
    isPopular?: boolean;
}

const plans: Plan[] = [
    { name: 'Apprentice', price: 69, durationMonths: 3, features: ['3 Months Access', 'Unlimited Generations', 'WisdomGPT Access', 'Priority Support'] },
    { name: 'Scholar', price: 119, durationMonths: 6, features: ['6 Months Access', 'Unlimited Generations', 'WisdomGPT Access', 'Priority Support'], isPopular: true },
    { name: 'Sage', price: 199, durationMonths: 12, features: ['12 Months Access', 'Unlimited Generations', 'WisdomGPT Access', 'Priority Support'] },
];

const PricingContent = () => {
    const { user } = useAuth();
    const { subscription, loading: subLoading } = useSubscription();
    const [isLoading, setIsLoading] = useState<number | null>(null);
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

    const handlePayment = async (plan: Plan, planIndex: number) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'You must be logged in to subscribe.' });
            return;
        }

        setIsLoading(planIndex);

        try {
            const order = await createOrder({
                amount: plan.price,
                currency: 'INR',
                userId: user.uid,
            });
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Wisdom Pro',
                description: `Subscription for ${plan.name} plan`,
                order_id: order.id,
                handler: function (response: any) {
                    const data = new URLSearchParams();
                    data.append('razorpay_payment_id', response.razorpay_payment_id);
                    data.append('razorpay_order_id', response.razorpay_order_id);
                    data.append('razorpay_signature', response.razorpay_signature);
                    data.append('plan_duration', plan.durationMonths.toString());
                    
                    // POST to our own API route for server-side verification
                    fetch('/api/payment-verification', {
                        method: 'POST',
                        body: data,
                    }).then(res => {
                        // The server will redirect, so we don't need to do much client side
                        if(res.ok) {
                           window.location.href = res.url;
                        } else {
                            toast({ variant: "destructive", title: "Verification Failed" });
                        }
                    });
                },
                prefill: {
                    name: user.displayName || 'New User',
                    email: user.email || '',
                },
                theme: {
                    color: '#3b82f6', // blue-500
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <AppLayout>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">Unlock Your Full Potential</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Choose a plan that fits your study schedule and get unlimited access to all AI-powered tools.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-8">
                    {plans.map((plan, index) => (
                        <Card key={plan.name} className={plan.isPopular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">{plan.name}</CardTitle>
                                <CardDescription>
                                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                                    <span className="text-muted-foreground"> / {plan.durationMonths} months</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={() => handlePayment(plan, index)}
                                    disabled={subLoading || isLoading === index || (subscription?.status === 'active' && subscription.plan.startsWith(plan.durationMonths.toString()))}
                                >
                                    {isLoading === index ? 'Processing...' : (subscription?.status === 'active' && subscription.plan.startsWith(plan.durationMonths.toString())) ? 'Current Plan' : 'Choose Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
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
