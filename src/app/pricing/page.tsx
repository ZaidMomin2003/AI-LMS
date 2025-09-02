
'use client';

import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { createPaypalOrder, capturePaypalOrder } from './actions';
import { useToast } from '@/hooks/use-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { SubscriptionPlan } from '@/types';
import type { OnApproveData, CreateOrderData } from '@paypal/paypal-js';

const allPlans = [
    {
        name: 'Weekly Pass',
        price: '9.00',
        priceId: 'price_123_weekly',
        period: '/ week',
        description: 'Perfect for short-term projects and exam cramming.',
        features: [
            'Unlimited Topic Generations',
            'Unlimited AI Roadmaps',
            'Unlimited Pomodoro Sessions',
            'Unlimited Captures',
            'SageMaker AI Assistant',
        ],
    },
    {
        name: 'Annual Pro',
        price: '249.00',
        priceId: 'price_123_yearly',
        period: '/ year',
        description: 'For the committed lifelong learner. The best value.',
        features: [
            'Everything in Weekly Pass',
            'Early access to new features',
            'Priority Support',
        ],
        bestValue: true,
    },
]

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

const PricingContent = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    
    return (
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture" }}>
            <section id="pricing" className="py-20 sm:py-32">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                            Choose Your Plan
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-muted-foreground">
                           Simple, transparent pricing. Unlimited access. Choose the plan that's right for you.
                        </p>
                    </div>
                    
                    <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-8 lg:max-w-4xl lg:grid-cols-2">
                        {allPlans.map((plan) => (
                            <Card key={plan.name} className={cn("relative flex flex-col", plan.bestValue ? "border-2 border-primary shadow-lg shadow-primary/20" : "")}>
                                {plan.bestValue && (
                                    <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                        <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                            Best Value
                                        </div>
                                    </div>
                                )}
                                <CardHeader className="pt-12">
                                    <CardTitle className="font-headline">{plan.name}</CardTitle>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                                        {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                                    </div>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                                <Check className="h-4 w-4 text-primary" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                     <div className="w-full">
                                        {isLoading === plan.priceId ? (
                                            <Button disabled className="w-full h-[45px]">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </Button>
                                        ) : (
                                            <PayPalButtons
                                                style={{ layout: "vertical", label: "pay", height: 45 }}
                                                disabled={isLoading !== null || !user}
                                                forceReRender={[plan.price, user]}
                                                createOrder={async (data: CreateOrderData) => {
                                                    if (!user) {
                                                        toast({ variant: 'destructive', title: 'Please log in to purchase.' });
                                                        return '';
                                                    }
                                                    setIsLoading(plan.priceId);
                                                    try {
                                                        const { orderID, error } = await createPaypalOrder(parseFloat(plan.price));
                                                        if (error || !orderID) {
                                                            throw new Error(error || 'Failed to create PayPal order.');
                                                        }
                                                        return orderID;
                                                    } catch (err: any) {
                                                        toast({ variant: 'destructive', title: 'Error', description: err.message });
                                                        setIsLoading(null);
                                                        return '';
                                                    }
                                                }}
                                                onApprove={async (data: OnApproveData) => {
                                                    if (!user) return;
                                                    try {
                                                        const { success, error } = await capturePaypalOrder(data.orderID, plan.name as SubscriptionPlan, user.uid);
                                                        if (success) {
                                                            toast({ title: 'Payment Successful!', description: `You are now subscribed to ${plan.name}.` });
                                                        } else {
                                                            throw new Error(error || 'Capture failed');
                                                        }
                                                    } catch (err: any) {
                                                        toast({ variant: 'destructive', title: 'Payment Failed', description: err.message || 'Could not finalize your payment.' });
                                                    } finally {
                                                        setIsLoading(null);
                                                    }
                                                }}
                                                onError={(err) => {
                                                    toast({ variant: 'destructive', title: 'PayPal Error', description: 'An error occurred with the PayPal transaction. Please try again.' });
                                                    setIsLoading(null);
                                                }}
                                                onCancel={() => setIsLoading(null)}
                                            />
                                        )}
                                        {!user && <p className="text-xs text-center text-muted-foreground mt-2">Please <Link href="/login" className="underline font-semibold">log in</Link> to purchase.</p>}
                                     </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </PayPalScriptProvider>
    )
}

export default function PricingPage() {
  const { user, loading } = useAuth();
  
  if (loading) {
      return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
        <AppLayout>
            <main className="flex-grow">
                <PricingContent />
            </main>
        </AppLayout>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}
