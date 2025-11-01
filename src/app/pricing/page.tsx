
'use client';

import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { createRazorpayOrder, verifyRazorpayPayment } from './actions';
import { useToast } from '@/hooks/use-toast';
import { motion, type Variants } from 'framer-motion';
import Script from 'next/script';

const allPlans = [
    {
        name: 'Hobby',
        price: '$0',
        period: 'Free Forever',
        description: 'Perfect for trying out the power of AI learning.',
        priceId: null,
        features: [
            { text: '1 Topic Generation', included: true },
            { text: '1 AI Roadmap Generation', included: true },
            { text: '1 Pomodoro Session', included: true },
            { text: '1 Capture the Answer', included: true },
            { text: 'Basic Support', included: false },
        ],
        buttonText: 'Start for Free',
        href: '/signup',
    },
    {
        name: 'Sage Mode',
        price: '$199',
        period: '/ year',
        description: 'The ultimate toolkit for dedicated lifelong learners. All features, unlimited.',
        priceId: 'SAGE_MODE_YEARLY',
        amount: 199, // For Razorpay
        features: [
            { text: 'Unlimited Topic Generations', included: true },
            { text: 'Unlimited AI Roadmaps', included: true },
            { text: 'Unlimited Pomodoro Sessions', included: true },
            { text: 'Unlimited Captures', included: true },
            { text: 'SageMaker AI Assistant', included: true },
            { text: 'Priority Support', included: true },
            { text: 'Early access to new features', included: true },
        ],
        buttonText: 'Go Sage Mode',
        highlight: true,
    },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 150,
    },
  },
};

const PricingContent = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handlePayment = async (amount: number) => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You must be logged in to subscribe.',
            });
            return;
        }

        setIsLoading('SAGE_MODE_YEARLY');

        try {
            const order = await createRazorpayOrder(amount, user.uid);
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Wisdomis Fun',
                description: 'Sage Mode Yearly Subscription',
                order_id: order.id,
                handler: async function (response: any) {
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        uid: user.uid,
                    };

                    const result = await verifyRazorpayPayment(verificationData);

                    if (result.success) {
                        toast({
                            title: 'Payment Successful!',
                            description: 'Welcome to Sage Mode! Your subscription is now active.',
                        });
                         // You might want to refresh subscription context or redirect here
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Payment Verification Failed',
                            description: 'Please contact support.',
                        });
                    }
                },
                prefill: {
                    name: user.displayName || 'ScholarAI User',
                    email: user.email || '',
                },
                theme: {
                    color: '#4B0082',
                },
            };
            
            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();
        
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: error.message || 'Could not initiate payment. Please try again.',
            });
        } finally {
            setIsLoading(null);
        }
    };
    
    return (
        <>
        <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <section id="pricing" className="relative w-full overflow-hidden py-20 sm:py-32">
             <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <h1 className="text-center text-12xl font-bold text-foreground/5 pointer-events-none">
                    Pricing
                </h1>
            </div>

            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-8xl font-bold tracking-tight text-foreground sm:text-9xl font-headline">
                      Pricing
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Start for free, then unlock more power as you grow. Simple, transparent pricing for every learner.
                    </p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className={cn("relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-2")}>
                    {allPlans.map((plan) => (
                        <Card key={plan.name} className={cn("relative flex flex-col", plan.highlight ? "border-2 border-primary shadow-lg shadow-primary/20" : "")}>
                            {plan.highlight && (
                                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Star className="w-4 h-4" />
                                        Unlimited Access
                                    </div>
                                </div>
                            )}
                            <CardHeader className="pt-12">
                                <CardTitle className="font-headline">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={cn("flex items-center gap-2 text-sm", feature.included ? 'text-foreground' : 'text-muted-foreground' )}>
                                            {feature.included ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {plan.priceId ? (
                                    <Button
                                        onClick={() => handlePayment(plan.amount!)}
                                        disabled={isLoading === plan.priceId}
                                        className="w-full"
                                        variant={plan.highlight ? 'default' : 'outline'}
                                    >
                                        {isLoading === plan.priceId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {plan.buttonText}
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full" variant={'outline'}>
                                        <Link href={plan.href!}>{plan.buttonText}</Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </motion.div>
            </div>
         </section>
         </>
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
