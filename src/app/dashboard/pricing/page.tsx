
'use client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Lock, Star, Ticket, X, Loader2, Sparkles, LifeBuoy, LayoutDashboard, Clock, CheckCircle, ArrowRight } from 'lucide-react';
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
    id: 'yearly' | 'lifetime';
    name: string;
    originalPrice: number;
    price: number;
    priceDescription: string;
    durationDays: number;
}

const couponSchema = z.object({
    code: z.string().min(1, 'Please enter a code.'),
});
type CouponFormValues = z.infer<typeof couponSchema>;

const CouponForm = ({ onSuccessfulCoupon }: { onSuccessfulCoupon: (discount: { yearly?: number, lifetime?: number }) => void }) => {
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
        <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="pb-4">
                <CardTitle className="font-black text-xl tracking-tighter uppercase flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <Ticket className="w-5 h-5" />
                    </div>
                    Neural Bypass
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-black tracking-widest opacity-40">Apply discount protocols to your membership</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                        <Input
                            {...form.register('code')}
                            placeholder="ENTER ACCESS CODE"
                            className="h-12 rounded-xl bg-background/50 border-border/10 font-bold tracking-widest placeholder:opacity-30 uppercase"
                        />
                        {form.formState.errors.code && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{form.formState.errors.code.message}</p>}
                    </div>
                    <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Redeem'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

const TimeCard = ({ value, unit }: { value: number, unit: string }) => (
    <div className="flex flex-col items-center flex-1 min-w-[50px] sm:min-w-[64px]">
        <div className="relative group/time w-full">
            <div className="text-lg sm:text-2xl font-black font-mono text-primary bg-background/40 border border-primary/20 backdrop-blur-md rounded-xl sm:rounded-2xl w-full py-2 sm:py-3 shadow-2xl group-hover/time:border-primary/50 transition-all text-center">
                {String(value).padStart(2, '0')}
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
        </div>
        <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mt-2 text-foreground/30">{unit}</div>
    </div>
)

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date('2026-03-15T00:00:00') - +new Date();
        let timeLeft: { days: number, hours: number, minutes: number, seconds: number } | {} = {};

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

        return timeLeft as { days: number, hours: number, minutes: number, seconds: number };
    };

    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    return (
        <div className="flex items-center gap-3 sm:gap-4 w-full max-w-sm">
            <TimeCard value={timeLeft.days} unit="Days" />
            <TimeCard value={timeLeft.hours} unit="Hrs" />
            <TimeCard value={timeLeft.minutes} unit="Mins" />
            <TimeCard value={timeLeft.seconds} unit="Secs" />
        </div>
    );
};


const PricingContent = () => {
    const { user } = useAuth();
    const { subscription, loading: subLoading } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const [plans, setPlans] = useState<Plan[]>([
        {
            id: 'yearly',
            name: 'Sage Mode',
            originalPrice: 199,
            price: 99,
            priceDescription: 'for 12 months of access',
            durationDays: 365,
        },
        {
            id: 'lifetime',
            name: 'Lifetime Sage',
            originalPrice: 999,
            price: 299,
            priceDescription: 'One-time payment',
            durationDays: 3650, // 10 years
        },
    ]);


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

    const handleSuccessfulCoupon = (discounts: { yearly?: number, lifetime?: number }) => {
        setPlans(prevPlans => prevPlans.map(plan => {
            if (plan.id === 'yearly' && discounts.yearly !== undefined) {
                return { ...plan, price: discounts.yearly };
            }
            if (plan.id === 'lifetime' && discounts.lifetime !== undefined) {
                return { ...plan, price: discounts.lifetime };
            }
            return plan;
        }));
    };

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
                    color: '#8b5cf6',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const sagePlan = plans.find(p => p.id === 'yearly')!;
    const lifetimePlan = plans.find(p => p.id === 'lifetime')!;

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
            <div className="flex-1 relative overflow-hidden bg-background">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

                <div className="relative z-10 px-4 py-12 md:py-20 lg:px-8">
                    <div className="max-w-5xl mx-auto space-y-16">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-none mb-4">
                                UPGRADE TO <span className="text-primary">SAGE MODE</span>
                            </h2>
                            <p className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60 max-w-2xl mx-auto">
                                Unlock the full neuro-syllabus potential with advanced study modules and AI-integrated protocols.
                            </p>
                        </div>

                        {/* Main Plan Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-[2.5rem] overflow-hidden border border-border/10 bg-card/20 backdrop-blur-3xl shadow-2xl relative group/main">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                            {/* Left Side - Details */}
                            <div className="lg:col-span-3 p-8 md:p-12 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner group-hover/main:border-primary/40 transition-all">
                                            <Gem className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-2xl tracking-tighter uppercase">Sage Subscription</h3>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-primary/60 italic">Precision Academic Protocol Activated</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-medium leading-relaxed max-w-lg">
                                        Join the collective of elite students utilizing advanced AI synthesis to absolute academic perfection. Lock in your session today.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-0">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-40">Monthly Intensity</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-6xl font-black tracking-tighter text-foreground">${monthlyPrice}</span>
                                            <span className="text-sm font-black uppercase tracking-widest opacity-20">/mo</span>
                                        </div>
                                    </div>
                                    <div className="h-12 w-px bg-border/10 hidden sm:block mx-10" />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Annual Total</p>
                                            {sagePlan.price < sagePlan.originalPrice && (
                                                <Badge variant="outline" className="h-5 px-1.5 text-[8px] font-black border-emerald-500/20 bg-emerald-500/10 text-emerald-500 rounded-lg">-{Math.round((1 - sagePlan.price / sagePlan.originalPrice) * 100)}% DISCOUNT</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            {sagePlan.price < sagePlan.originalPrice && (
                                                <span className="text-xl font-bold line-through text-muted-foreground/20">${sagePlan.originalPrice}</span>
                                            )}
                                            <span className="text-2xl font-black tracking-tighter opacity-80">${sagePlan.price}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">/year</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    {subLoading || isLoading ? (
                                        <Button size="lg" className="h-16 w-full rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-[0.2em] text-xs" disabled>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Processing Sequence...
                                        </Button>
                                    ) : subscription?.status === 'active' ? (
                                        <div className="h-16 w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Subscription Active</span>
                                        </div>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="h-16 w-full rounded-2xl bg-primary hover:bg-primary/90 hover:scale-[1.01] active:scale-95 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 transition-all group"
                                            onClick={() => handlePayment(sagePlan)}
                                        >
                                            Initialize Sage Mode
                                            <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - Features */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-primary via-primary to-blue-600 p-8 md:p-12 text-white relative flex flex-col justify-center">
                                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-black/20 to-transparent" />

                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <h4 className="text-lg font-black tracking-tighter uppercase mb-1">Full Integrated access</h4>
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Complete Protocol Inventory</p>
                                    </div>
                                    <ul className="space-y-4">
                                        {proFeatures.map(feature => (
                                            <li key={feature} className="flex items-center gap-4 group/item">
                                                <div className="h-6 w-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover/item:bg-white/20 transition-all shadow-lg">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm font-bold tracking-tight opacity-90 group-hover/item:opacity-100 transition-all">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Lifetime Card */}
                        <div className="relative group overflow-hidden rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl shadow-2xl p-0.5 transition-all hover:border-amber-500/30">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
                            <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10 group-hover:bg-amber-500/20 transition-all duration-700" />

                            <div className="bg-gradient-to-br from-amber-500/5 via-transparent to-transparent rounded-[2.4rem] p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:30px_30px] pointer-events-none" />

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                                    <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
                                        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Universal Expansion Access</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tighter leading-none">
                                            LIFETIME <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent italic">SAGE</span>
                                        </h3>
                                        <p className="text-muted-foreground font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed">
                                            Complete neural dominance. Unlimited access, locked forever. One single transmission, infinite wisdom synthesis.
                                        </p>
                                    </div>

                                    <div className="lg:col-span-3 flex justify-center">
                                        <div className="w-full">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-center mb-4 text-amber-500/40">Window Closing In</div>
                                            <CountdownTimer />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-8">
                                        <div className="text-center lg:text-right space-y-1">
                                            <div className="flex items-baseline justify-center lg:justify-end gap-3 mb-1">
                                                {lifetimePlan.price < lifetimePlan.originalPrice && (
                                                    <span className="text-2xl font-black tracking-tighter line-through text-muted-foreground/20 leading-none">${lifetimePlan.originalPrice}</span>
                                                )}
                                                <span className="text-6xl font-black tracking-tighter leading-none text-foreground">${lifetimePlan.price}</span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/40">Definitive One-Time Protocol</p>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="h-16 w-full md:w-auto px-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                                            onClick={() => handlePayment(lifetimePlan)}
                                            disabled={isLoading || subLoading || subscription?.status === 'active'}
                                        >
                                            {isLoading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : 'Engage Lifetime Access'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Coupon & Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/10">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold uppercase text-xs tracking-widest leading-none mb-1">Secure Transmission</h5>
                                        <p className="text-[10px] text-muted-foreground/60 uppercase font-medium tracking-widest">Encypted via Razorpay Protocol</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                                    Your academic evolution is secured. Subscriptions can be managed via the profile interface. All protocols are final.
                                </p>
                            </div>

                            {subscription?.status !== 'active' && <CouponForm onSuccessfulCoupon={handleSuccessfulCoupon} />}
                        </div>
                    </div>
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
