
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
import { createOrder } from './actions';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Plan {
    name: string;
    price: number;
    priceDescription: string;
    durationMonths: number;
    features: string[];
    isPopular?: boolean;
    isFree?: boolean;
}

const allFeatures = [
    { name: 'Unlimited Topic Generations', pro: true },
    { name: 'Unlimited Study Roadmaps', pro: true },
    { name: 'Unlimited Pomodoro Timers', pro: true },
    { name: 'Unlimited Capture Tool', pro: true },
    { name: 'WisdomGPT AI Assistant', pro: true, isStar: true },
    { name: 'Priority Email Support', pro: true },
];


const plans: Plan[] = [
    { 
        name: 'Free', 
        price: 0, 
        priceDescription: 'to get started',
        durationMonths: 0,
        isFree: true,
        features: [
            '1 Topic Generation',
            '1 Study Roadmap',
            '1 Pomodoro Session',
            '1 Capture Use',
        ]
    },
    { 
        name: 'Apprentice', 
        price: 69, 
        priceDescription: 'for 3 months',
        durationMonths: 3, 
        features: allFeatures.map(f => f.name)
    },
    { 
        name: 'Scholar', 
        price: 119, 
        priceDescription: 'for 6 months',
        durationMonths: 6, 
        features: allFeatures.map(f => f.name),
        isPopular: true 
    },
    { 
        name: 'Sage', 
        price: 199, 
        priceDescription: 'for 12 months',
        durationMonths: 12, 
        features: allFeatures.map(f => f.name)
    },
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
                    
                    fetch('/api/payment-verification', {
                        method: 'POST',
                        body: data,
                    }).then(res => {
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
                    color: '#3b82f6', 
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pt-8 items-start">
                    {plans.map((plan, index) => (
                        <Card key={plan.name} className={cn(
                            "flex flex-col h-full",
                            plan.isPopular ? 'border-primary ring-2 ring-primary shadow-2xl shadow-primary/20' : '',
                            plan.isFree ? 'md:col-span-2 lg:col-span-1' : 'md:col-span-1'
                        )}>
                             {plan.isPopular && (
                                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 text-center rounded-t-lg">Most Popular</div>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                <CardDescription className="flex flex-col">
                                   {plan.isFree ? (
                                        <span className="text-4xl font-bold text-foreground">Free</span>
                                   ) : (
                                        <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                                   )}
                                    <span className="text-muted-foreground text-sm mt-1">{plan.priceDescription}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <ul className="space-y-3">
                                    {allFeatures.map(feature => (
                                        <li key={feature.name} className="flex items-center gap-3 text-sm">
                                            {plan.isFree ? (
                                                feature.pro ? <X className="w-5 h-5 text-muted-foreground/50" /> : <Check className="w-5 h-5 text-primary" />
                                            ) : (
                                                feature.isStar ? <Star className="w-5 h-5 text-yellow-500 fill-current" /> : <Check className="w-5 h-5 text-primary" />
                                            )}
                                            <span className={cn(plan.isFree && !feature.pro && 'text-muted-foreground/50')}>{feature.name}</span>
                                        </li>
                                    ))}
                                    {plan.isFree && plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-sm">
                                            <Check className="w-5 h-5 text-primary" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {plan.isFree ? (
                                     <Button className="w-full" variant="outline" disabled>Your Current Plan</Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => handlePayment(plan, index)}
                                        disabled={subLoading || isLoading === index || subscription?.status === 'active' && subscription.plan?.startsWith(plan.durationMonths.toString())}
                                    >
                                        {isLoading === index ? 'Processing...' : (subscription?.status === 'active' && subscription.plan?.startsWith(plan.durationMonths.toString())) ? 'Current Plan' : 'Choose Plan'}
                                    </Button>
                                )}
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
