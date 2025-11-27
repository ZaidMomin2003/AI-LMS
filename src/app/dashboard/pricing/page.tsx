
'use client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Lock, Star, Ticket, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { applyCouponAction } from './actions';
import Link from 'next/link';

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

const couponSchema = z.object({
  code: z.string().min(1, 'Please enter a code.'),
});
type CouponFormValues = z.infer<typeof couponSchema>;

const CouponCodeForm = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: { code: '' },
    });
    
    const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'You must be logged in.'});
            return;
        }
        setIsLoading(true);
        try {
            const result = await applyCouponAction(data.code, user.uid);
            if (result.success) {
                toast({ title: 'Coupon Applied!', description: result.message });
                form.reset();
            } else {
                toast({ variant: 'destructive', title: 'Invalid Coupon', description: result.message });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not apply coupon. Please try again.'});
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <Card className="max-w-md w-full mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Ticket className="w-5 h-5 text-primary" />
            Have a Coupon Code?
          </CardTitle>
          <CardDescription>Enter your code below to apply your discount.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Input {...form.register('code')} placeholder="Enter your coupon" />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
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
    const monthlyPrice = (sagePlan.price / sagePlan.durationMonths).toFixed(2);


    const freeFeatures = [
        { text: '1 Topic Generation', included: true },
        { text: '1 Study Roadmap', included: true },
        { text: '1 Pomodoro Session', included: true },
        { text: '1 Capture Use', included: true },
        { text: 'WisdomGPT AI Assistant', included: false },
        { text: 'Priority Email Support', included: false },
    ];
    
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
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 max-w-4xl mx-auto pt-8">
                     {/* Free Plan */}
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Free</CardTitle>
                            <CardDescription>For casual learners to get a taste of AI power.</CardDescription>
                            <div className="pt-4">
                                <span className="text-4xl font-bold text-foreground">{currencySymbol}0</span>
                                <span className="text-muted-foreground"> / forever</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                            <ul className="space-y-3">
                                {freeFeatures.map(feature => (
                                    <li key={feature.text} className="flex items-center gap-3 text-sm">
                                        {feature.included ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-muted-foreground" />}
                                        <span className={cn(!feature.included && 'text-muted-foreground')}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" variant="outline" disabled={true}>
                                <Link href="#">Your Current Plan</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="flex flex-col h-full border-primary ring-2 ring-primary shadow-2xl shadow-primary/20">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">{sagePlan.name}</CardTitle>
                             <CardDescription className="flex flex-col">
                                <span className="text-4xl font-bold text-foreground">{currencySymbol}{monthlyPrice} <span className="text-xl text-muted-foreground">/mo</span></span>
                                <span className="text-muted-foreground text-sm mt-1">Billed annually at ${sagePlan.price}</span>
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
                                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</>) 
                                : (subscription?.status === 'active') ? 'Your Current Plan' 
                                : (<><Gem className="mr-2 h-4 w-4" /> Get Sage Plan</>)}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                {subscription?.status !== 'active' && <CouponCodeForm />}
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
