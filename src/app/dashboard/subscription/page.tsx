
'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle, Gem, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createPayPalOrder } from './actions';
import { useSubscription } from '@/context/SubscriptionContext';

const PlanCard = ({ 
    planName, 
    price, 
    description, 
    features, 
    isAnnual, 
    onChoosePlan,
    isLoading,
    currentPlan,
} : {
    planName: 'Weekly Pass' | 'Annual Pro';
    price: string;
    description: string;
    features: string[];
    isAnnual?: boolean;
    onChoosePlan: (plan: 'Weekly Pass' | 'Annual Pro') => void;
    isLoading: boolean;
    currentPlan: string | null;
}) => {
    const isCurrent = currentPlan === planName;
    return (
        <Card className={cn("flex flex-col", isAnnual && "border-primary shadow-primary/20 shadow-lg")}>
            <CardHeader>
                <CardTitle className="font-headline">{planName}</CardTitle>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">/{isAnnual ? 'year' : 'week'}</span>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {features.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={() => onChoosePlan(planName)} 
                    disabled={isLoading || isCurrent}
                    variant={isAnnual ? 'default' : 'secondary'}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isCurrent ? 'Current Plan' : 'Choose Plan'}
                </Button>
            </CardFooter>
        </Card>
    )
};


export default function SubscriptionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { subscription, loading: subLoading } = useSubscription();

    const handleChoosePlan = async (plan: 'Weekly Pass' | 'Annual Pro') => {
        setIsLoading(true);
        try {
            const price = plan === 'Annual Pro' ? '49.00' : '7.00';
            const { approvalUrl } = await createPayPalOrder(plan, price);
            // Redirect user to PayPal to approve the payment
            window.location.href = approvalUrl;
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (subLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">
                        Choose Your Plan
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Unlock the full power of Wisdomis Fun. Cancel anytime.
                    </p>
                </div>
                
                {subscription?.status === 'active' && (
                    <Card className="max-w-xl mx-auto bg-green-500/10 border-green-500/20">
                        <CardHeader className="text-center">
                            <CardTitle>You have an active subscription!</CardTitle>
                            <CardDescription>
                                You are currently on the <span className="font-bold">{subscription.planName}</span> plan. Manage your subscription via your payment provider.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <div className="flex items-center justify-center space-x-2">
                    <Label className='text-muted-foreground'>Payments powered by PayPal</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <PlanCard
                        planName="Weekly Pass"
                        price="7"
                        description="Perfect for a single project or exam crunch time."
                        features={['7-Day Full Access', 'Unlimited Generations', 'SageMaker AI Chat', 'All Pro Features']}
                        onChoosePlan={handleChoosePlan}
                        isLoading={isLoading}
                        currentPlan={subscription?.planName || null}
                    />
                     <PlanCard
                        planName="Annual Pro"
                        price="49"
                        description="Best value for a full year of unlimited learning."
                        features={['1-Year Full Access', 'Unlimited Generations', 'SageMaker AI Chat', 'Save over 85%']}
                        isAnnual
                        onChoosePlan={handleChoosePlan}
                        isLoading={isLoading}
                        currentPlan={subscription?.planName || null}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
