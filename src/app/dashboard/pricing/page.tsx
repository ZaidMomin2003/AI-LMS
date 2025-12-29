
'use client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Lock, Star, Ticket, X, Loader2, Sparkles, LifeBuoy, LayoutDashboard, Clock } from 'lucide-react';
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
import { motion } from 'framer-motion';

interface Plan {
    name: string;
    price: number;
    priceDescription: string;
    durationDays: number;
}

const weeklyPlan: Plan = {
    name: 'Weekly Pass',
    price: 4.99,
    priceDescription: '7-day access',
    durationDays: 7,
};

const sagePlan: Plan = {
    name: 'Sage Mode', 
    price: 199, 
    priceDescription: 'for 12 months of access',
    durationDays: 365, 
};

const lifetimePlan: Plan = {
    name: 'Lifetime Sage',
    price: 999,
    priceDescription: 'One-time payment',
    durationDays: 3650, // 10 years
};


const couponSchema = z.object({
  code: z.string().min(1, 'Please enter a code.'),
});
type CouponFormValues = z.infer<typeof couponSchema>;

const CouponForm = ({ onSuccessfulCoupon }: { onSuccessfulCoupon: (price: number) => void }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: { code: '' },
    });

    const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
        if (!user) {
            toast({ variant: "destructive", title: "You must be logged in." });
            return;
        }
        setIsLoading(true);
        const result = await applyCouponAction(data.code, user.uid);
        if (result.success) {
            toast({ title: "Success!", description: result.message });
            if (result.discountedPrice) {
                onSuccessfulCoupon(result.discountedPrice);
            }
            form.reset();
        } else {
            toast({ variant: "destructive", title: "Coupon Error", description: result.message });
        }
        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" /> Have a Coupon?</CardTitle>
                <CardDescription>Enter your special coupon code below to redeem your offer.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                        <Input 
                            {...form.register('code')}
                            placeholder="PASTE COUPON"
                            className="uppercase"
                        />
                        {form.formState.errors.code && <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>}
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Redeem'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date('2026-01-10T00:00:00') - +new Date();
        let timeLeft: {days: number, hours: number, minutes: number, seconds: number} | {} = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return timeLeft as {days: number, hours: number, minutes: number, seconds: number};
    };

    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

    useEffect(() => {
        // Set initial time on mount to avoid hydration mismatch
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const timerComponents: {unit: 'days' | 'hours' | 'minutes' | 'seconds', label: string}[] = [
        { unit: 'days', label: 'Days' },
        { unit: 'hours', label: 'Hrs' },
        { unit: 'minutes', label: 'Mins' },
        { unit: 'seconds', label: 'Secs' },
    ];
    
    if (!timeLeft) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 sm:gap-4">
            {timerComponents.map(part => (
                <div key={part.unit} className="flex flex-col items-center">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-primary-foreground bg-black rounded-md w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                        {String(timeLeft[part.unit] || 0).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-wider mt-1 text-primary-foreground/70">{part.label}</div>
                </div>
            ))}
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

    const handlePayment = async (plan: Plan) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'You must be logged in to subscribe.' });
            return;
        }

        setIsLoading(true);

        try {
            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: plan.price, userId: user.uid, currency: 'USD' }),
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
                description: `Subscription for ${plan.name} plan`,
                order_id: orderData.id,
                handler: function (response: any) {
                    const data = new URLSearchParams();
                    data.append('razorpay_payment_id', response.razorpay_payment_id);
                    data.append('razorpay_order_id', response.razorpay_order_id);
                    data.append('razorpay_signature', response.razorpay_signature);
                    data.append('plan_duration_days', plan.durationDays.toString());
                    
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
                    color: '#BF00FF', 
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
    
    const monthlyPrice = (sagePlan.price / 12).toFixed(2);
    
    const proFeatures = [
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
            <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center bg-zinc-900 text-white">
                <div className="w-full max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline">Unlock Your Full Potential</h2>
                        <p className="text-zinc-400 mt-2">Choose the plan that will propel you to your academic goals.</p>
                    </div>

                    <Card className="relative p-0.5 rounded-2xl bg-gradient-to-br from-primary/50 to-zinc-800">
                        <div className="rounded-[15px] bg-zinc-900 p-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Side */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold font-headline text-primary">Sage Mode</h3>
                                    <p className="text-zinc-300">Join thousands of top students and lock in your price before it increases.</p>
                                    
                                    <div className="flex items-end gap-4">
                                        <div>
                                            <span className="text-4xl font-bold">${monthlyPrice}</span>
                                            <span className="text-zinc-400">/mo</span>
                                        </div>
                                        <div className="border-l border-zinc-600 pl-4">
                                            <span className="text-xl font-bold">${sagePlan.price}</span>
                                            <span className="text-zinc-400">/year</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="bg-blue-500 text-white rounded-xl p-6 space-y-4">
                                    <p className="font-semibold text-sm">Everything in Sage includes:</p>
                                    <ul className="space-y-3">
                                        {proFeatures.map(feature => (
                                            <li key={feature} className="flex items-center gap-3 text-xs">
                                                <Check className="w-4 h-4 text-white/70" />
                                                <span className="text-white">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             </div>
                             <div className="mt-8">
                                {subLoading || isLoading ? (
                                    <Button size="lg" className="w-full font-bold text-base" disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...
                                    </Button>
                                ) : subscription?.status === 'active' ? (
                                    <motion.div
                                        className="group relative overflow-hidden rounded-md border-[1px] border-blue-500/50 bg-blue-600/90 text-white transition-colors"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2 px-3 py-2.5 font-mono text-sm font-medium uppercase text-center w-full">
                                            <Check className="h-4 w-4" />
                                            <span>You are on a Pro Plan</span>
                                        </div>
                                        <motion.span
                                            initial={{ y: "100%" }}
                                            animate={{ y: "-100%" }}
                                            transition={{ repeat: Infinity, repeatType: "mirror", duration: 1, ease: "linear" }}
                                            className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-blue-500/0 from-40% via-blue-400/100 to-blue-500/0 to-60% opacity-100"
                                        />
                                    </motion.div>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="w-full font-bold text-base bg-primary hover:bg-primary/90"
                                        onClick={() => handlePayment(sagePlan)}
                                    >
                                        Sign up for Sage
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="relative w-full overflow-hidden bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-2xl shadow-primary/30">
                        <div 
                            className="absolute inset-0 bg-repeat bg-[url('https://res.cloudinary.com/dfhpkqrjw/image/upload/v1717676769/confetti_y39svn.gif')]"
                            style={{ opacity: 0.1, backgroundSize: '300px' }} 
                        />
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{backgroundSize: '30px 30px'}}/>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
                            <div className="md:col-span-1 space-y-2">
                                 <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-xs font-medium mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span>New Year Offer</span>
                                </div>
                                <h3 className="text-2xl font-headline font-bold">Lifetime Sage</h3>
                                <p className="text-primary-foreground/80">Unlimited access, forever. One payment, endless learning.</p>
                            </div>

                            <div className="md:col-span-1 flex items-center justify-center">
                                <CountdownTimer />
                            </div>

                            <div className="md:col-span-1 flex flex-col items-center md:items-end text-center md:text-right">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-semibold line-through text-primary-foreground/70">$1499</span>
                                    <p className="text-4xl font-bold">${lifetimePlan.price}</p>
                                </div>
                                <p className="text-sm text-primary-foreground/80">One-time payment</p>
                                 <Button 
                                    className="mt-4 w-full md:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                    onClick={() => handlePayment(lifetimePlan)}
                                    disabled={isLoading || subLoading || subscription?.status === 'active'}
                                >
                                     {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Get Lifetime Access'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {subscription?.status !== 'active' && <CouponForm onSuccessfulCoupon={(amount) => handlePayment({ ...sagePlan, price: amount })} />}
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
