
'use client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Lock, Star, Ticket, X, Loader2, Sparkles } from 'lucide-react';
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
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Have a coupon code?</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 max-w-sm mx-auto mt-2">
                <Input {...form.register('code')} placeholder="Enter code 'FIRST25'" className="bg-background/50" />
                <Button type="submit" disabled={isLoading} variant="secondary">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                </Button>
            </form>
        </div>
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
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">One Plan to Rule Them All</h2>
                    <p className="text-muted-foreground">
                        Simple, transparent pricing. Get every feature we have, and every feature we will ever build, with one single plan.
                    </p>
                </div>
                
                <div className="max-w-md mx-auto">
                    <Card className="shadow-2xl shadow-primary/10 overflow-hidden">
                        <CardHeader className="p-8 bg-card relative overflow-hidden bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 animate-liquid-gradient" style={{ backgroundSize: '400% 400%' }}>
                            <div className="flex justify-between items-center text-primary-foreground">
                                <h3 className="text-2xl font-headline font-bold">{sagePlan.name} Plan</h3>
                                <div className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">Save 25%</div>
                            </div>
                            <CardDescription className="flex flex-col pt-4">
                                <span className="text-4xl font-bold text-primary-foreground">{currencySymbol}{monthlyPrice} <span className="text-xl text-primary-foreground/80">/mo</span></span>
                                <span className="text-primary-foreground/80 text-sm mt-1">Billed annually at ${sagePlan.price}</span>
                            </CardDescription>
                            <Button
                                size="lg"
                                className="w-full mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                onClick={handlePayment}
                                disabled={subLoading || isLoading || subscription?.status === 'active'}
                            >
                                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</>) 
                                : (subscription?.status === 'active') ? 'Your Current Plan' 
                                : (<><Gem className="mr-2 h-4 w-4" /> Get Sage Plan</>)}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8 bg-black border-t-2 border-white">
                            <p className="text-sm font-semibold text-white mb-4">Everything in Free, plus:</p>
                            <ul className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                {sageFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-primary" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                
                <Card className="max-w-md mx-auto mt-8 p-6 bg-secondary/50 border-dashed">
                    <CardContent className="p-0 text-center space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <Sparkles className="w-4 h-4" />
                            <span>Limited Time Offer</span>
                        </div>
                        <p className="text-foreground max-w-sm mx-auto">
                            Your free trial awaits. Lock in our introductory price forever before it increases soon.
                        </p>
                        {subscription?.status !== 'active' && <CouponCodeForm />}
                    </CardContent>
                </Card>
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
