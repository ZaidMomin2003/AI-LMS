
'use client';

import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2, X, FileText, BrainCircuit, MessageCircleQuestion, Bot, Map, DollarSign, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { createRazorpayOrder, verifyRazorpayPayment } from './actions';
import { useToast } from '@/hooks/use-toast';
import { motion, type Variants } from 'framer-motion';
import Script from 'next/script';
import type { LucideProps } from 'lucide-react';

const allPlans = [
    {
        name: 'Hobby',
        price: '$0',
        period: 'Free Forever',
        description: 'Perfect for trying out the power of AI learning.',
        priceId: null,
        amount: 0,
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
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-headline">
                      Choose Your Plan
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
         <ComparisonTable />
         </>
    )
}

const comparisonFeatures = [
    { name: 'AI Note Generation', icon: FileText, wisdomis: true, learnsphere: true, quizwiz: false },
    { name: 'AI Flashcards', icon: BrainCircuit, wisdomis: true, learnsphere: true, quizwiz: true },
    { name: 'AI Quizzes', icon: MessageCircleQuestion, wisdomis: true, learnsphere: true, quizwiz: true },
    { name: 'AI Chat Tutor', icon: Bot, wisdomis: true, learnsphere: true, quizwiz: false },
    { name: 'AI Roadmap Planner', icon: Map, wisdomis: true, learnsphere: false, quizwiz: false },
    { name: 'Dedicated Support', icon: Check, wisdomis: true, learnsphere: true, quizwiz: false },
];

const competitors = [
    { name: 'Wisdomis Fun', price: '$199/year', logo: Sparkles },
    { name: 'LearnSphere', price: '$20/month', logo: null },
    { name: 'QuizWiz AI', price: '$10/month', logo: null },
];

const ComparisonTable = () => (
    <section className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-headline">
                    Unbeatable Value
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    Get more features for a fraction of the cost. Wisdomis Fun is designed to be powerful, not pricey.
                </p>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-max mx-auto bg-card border rounded-2xl p-6 shadow-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-4 text-left font-headline text-lg w-1/3">Features</th>
                                {competitors.map((comp, i) => (
                                    <th key={comp.name} className={cn("p-4 text-center w-1/4", i === 0 && "rounded-t-lg bg-primary/10")}>
                                        <div className="flex flex-col items-center gap-1">
                                            {comp.logo ? <comp.logo className="w-6 h-6 text-primary"/> : <span className="font-bold">{comp.name}</span>}
                                            {i === 0 && <span className="font-bold">{comp.name}</span>}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonFeatures.map((feature) => (
                                <tr key={feature.name} className="border-b last:border-none hover:bg-secondary/50">
                                    <td className="p-4 flex items-center gap-3">
                                        <feature.icon className="w-5 h-5 text-muted-foreground" />
                                        <span className="font-medium">{feature.name}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                                    </td>
                                    <td className="p-4 text-center">
                                        {feature.learnsphere ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feature.quizwiz ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t-2">
                                <td className="p-4 font-headline text-lg flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                                    Pricing
                                </td>
                                <td className="p-4 text-center font-bold text-lg bg-primary/10 rounded-b-lg">
                                    <div className="flex flex-col">
                                        <span>$199</span>
                                        <span className="text-xs font-normal text-primary">per year</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold text-lg text-muted-foreground">
                                     <div className="flex flex-col">
                                        <span>$20</span>
                                        <span className="text-xs font-normal">per month</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold text-lg text-muted-foreground">
                                     <div className="flex flex-col">
                                        <span>$10</span>
                                        <span className="text-xs font-normal">per month</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
);


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

    