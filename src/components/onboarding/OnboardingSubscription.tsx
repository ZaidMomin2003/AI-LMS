
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2 } from 'lucide-react';
import { createPayPalOrder } from '@/app/dashboard/subscription/actions';
import { useSubscription } from '@/context/SubscriptionContext';
import Image from 'next/image';

const features = [
    "Unlimited Topic Generations",
    "AI-Powered Notes, Flashcards & Quizzes",
    "SageMaker AI Assistant",
    "Personalized Study Roadmaps",
    "Early access to new features",
];

function SubscriptionComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState('299.00');
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const hasPromo = searchParams.get('promo') === 'true';

    useEffect(() => {
        if (hasPromo) {
            setPrice('249.00');
        }
    }, [hasPromo]);
    
    const handleSubscription = async () => {
        setIsLoading(true);
        try {
            const { approvalUrl } = await createPayPalOrder('Annual Pro', price);
            if (approvalUrl) {
                // Redirect user to PayPal to approve the payment
                window.location.href = approvalUrl;
            } else {
                throw new Error("Could not get PayPal approval URL.");
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: error.message || 'An unexpected error occurred while setting up PayPal.',
            });
            setIsLoading(false);
        }
    };
    
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-4">
            <Image
                src="/image.png"
                alt="AI Research Assistant"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-30"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

            <div className="relative z-20 mx-auto flex h-full w-full max-w-sm flex-col justify-between text-white">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Wisdomis Fun Pro</h1>
                    <p className="mt-2 text-white/80">Unlock the most powerful AI study assistant.</p>
                </div>

                <div className="my-8 space-y-3">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-blue-400" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
                
                <div>
                    <div className="rounded-xl border-2 border-blue-400 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Yearly</p>
                            <div className="flex items-baseline">
                                {hasPromo && <p className="mr-2 text-lg text-white/70 line-through">$299</p>}
                                <p className="text-2xl font-bold">${price}</p>
                            </div>
                        </div>
                        {hasPromo && <p className="mt-1 text-sm text-blue-300">Institute discount applied!</p>}
                    </div>

                    <Button 
                        onClick={handleSubscription}
                        disabled={isLoading}
                        className="mt-4 h-12 w-full rounded-full bg-blue-500 text-lg font-semibold text-white transition-all hover:bg-blue-400"
                    >
                         {isLoading ? <Loader2 className="animate-spin" /> : 'Subscribe with PayPal'}
                    </Button>
                    <p className="mt-4 text-center text-xs text-white/50">
                        By subscribing, you agree to our Terms and Privacy Policy. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}


export function OnboardingSubscription() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <SubscriptionComponent />
        </Suspense>
    );
}
