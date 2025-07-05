
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
import { useRouter } from 'next/navigation';
import { createCheckoutLink } from './actions';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/AppLayout';

const allPlans = [
    {
        name: 'Hobby',
        price: '$0',
        period: 'One-time use',
        description: 'Perfect for trying out the power of AI learning.',
        features: [
            '1 Topic Generation',
            'Generate Study Notes',
            'Generate Flashcards',
            'Generate a Quiz'
        ],
        buttonText: 'Start for Free',
        href: '/signup',
        priceId: null,
    },
    {
        name: 'Rapid Student',
        price: '$7',
        period: '/ week',
        description: 'Ideal for short-term projects and exam cramming.',
        priceId: 'pri_01jzc7zdz6f02r7566a2rkrv9n',
        features: [
            'Unlimited Topic Generations',
            'Everything in Hobby',
            'Export to Markdown',
            'Email Support'
        ],
        buttonText: 'Choose Plan',
    },
    {
        name: 'Scholar Subscription',
        price: '$19',
        period: '/ month',
        description: 'The complete toolkit for dedicated learners.',
        priceId: 'pri_01jzc809gq2wh83r56m3wtcp69',
        features: [
            'Everything in Scholar',
            'Advanced Quiz Options',
            'Summarization Feature',
            'Priority Support'
        ],
        buttonText: 'Choose Plan',
        popular: true,
    },
    {
        name: 'Sage Mode',
        price: '$169',
        period: '/ year',
        description: 'For the committed lifelong learner. Save over 20%!',
        priceId: 'pri_01jzc81agc7c26b3z9039jcefj',
        features: [
            'Everything in Scholar',
            'Early access to new features',
            'Save 2 months',
            'Dedicated Support Channel'
        ],
        buttonText: 'Choose Plan',
        bestValue: true,
    },
]

const PricingContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

    const plans = user ? allPlans.filter(p => p.priceId) : allPlans;

    const handleCheckout = async (priceId: string) => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setLoadingPriceId(priceId);
        const result = await createCheckoutLink({ priceId }, user.email);
        setLoadingPriceId(null);

        if ('url' in result && result.url) {
            window.location.href = result.url;
        } else if ('error' in result) {
            toast({
                variant: 'destructive',
                title: 'Checkout Error',
                description: result.error,
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'An Unexpected Error Occurred',
                description: 'Could not get a checkout URL. Please try again.',
            });
        }
    };
    
    return (
        <section id="pricing" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Choose Your Plan
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Start for free, then unlock more power as you grow. Simple, transparent pricing for every learner.
                    </p>
                </div>

                <div className={cn("mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-8", user ? 'lg:max-w-none lg:grid-cols-3' : 'lg:max-w-none lg:grid-cols-4' )}>
                    {plans.map((plan) => (
                        <Card key={plan.name} className={cn("relative flex flex-col", plan.popular ? "border-2 border-primary shadow-lg shadow-primary/20" : "")}>
                            {plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Star className="w-4 h-4" />
                                        Most Popular
                                    </div>
                                </div>
                            )}
                            {plan.bestValue && !plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                        Best Value
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
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {plan.priceId ? (
                                    <Button
                                        onClick={() => handleCheckout(plan.priceId!)}
                                        disabled={loadingPriceId === plan.priceId}
                                        className="w-full"
                                        variant={plan.popular ? 'default' : 'outline'}
                                    >
                                        {loadingPriceId === plan.priceId ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
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
                </div>
            </div>
         </section>
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
