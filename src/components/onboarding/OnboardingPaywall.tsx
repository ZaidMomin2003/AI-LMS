
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Crown, Gem, Loader2, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface Plan {
    id: 'weekly' | 'yearly' | 'lifetime';
    name: string;
    price: number;
    priceDescription: string;
    durationDays: number;
    features: string[];
    isPopular?: boolean;
}

const plans: Plan[] = [
    {
        id: 'weekly',
        name: 'Weekly Pass',
        price: 4.99,
        priceDescription: 'Billed once',
        durationDays: 7,
        features: ['Full access for 7 days', 'Unlimited Generations'],
        isPopular: true,
    },
    {
        id: 'yearly',
        name: 'Sage Mode',
        price: 99,
        priceDescription: 'Billed annually',
        durationDays: 365,
        features: ['Best value for long term', 'All Pro features'],
    },
    {
        id: 'lifetime',
        name: 'Lifetime Sage',
        price: 299,
        priceDescription: 'One-time payment',
        durationDays: 3650, // 10 years
        features: ['Pay once, own forever', 'All future updates'],
    },
];

export function OnboardingPaywall({ onContinueFree }: { onContinueFree: () => void }) {
    const [selectedPlanId, setSelectedPlanId] = useState<Plan['id']>('weekly');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const selectedPlan = plans.find(p => p.id === selectedPlanId)!;

    const handlePurchase = () => {
        // Instead of processing payment here, redirect to the full pricing page
        // where the payment logic is already handled.
        router.push(`/dashboard/pricing?plan=${selectedPlanId}`);
    };

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

            <h1 className="text-3xl font-headline font-bold mb-2">Unlock Your Potential</h1>
            <p className="text-muted-foreground mb-6">
                Supercharge your learning with Wisdom Pro. It’s powerful, and we’ve made it as affordable as possible.
            </p>

            <div className="space-y-3 mb-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={cn(
                            'text-left p-4 cursor-pointer transition-all relative overflow-hidden',
                            selectedPlanId === plan.id ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:border-primary/50'
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-b-md">
                                MOST POPULAR
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                                    selectedPlanId === plan.id ? 'border-primary bg-primary' : 'border-muted-foreground/50'
                                )}
                            >
                                {selectedPlanId === plan.id && <Check className="w-4 h-4 text-primary-foreground" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground">{plan.features.join(' • ')}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">${plan.price.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">{plan.priceDescription}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Button onClick={handlePurchase} size="lg" className="w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : `Upgrade to ${selectedPlan.name}`}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
                You will be redirected to complete your purchase.
            </p>
            <Button onClick={onContinueFree} variant="link" className="mt-4 text-muted-foreground">
                Continue with Free Trial
            </Button>
        </div>
    );
}
