
'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { ChatMain } from '@/components/chat/ChatMain';
import { useToast } from '@/hooks/use-toast';
import { capturePayPalOrder } from './subscription/actions';
import { useSubscription } from '@/context/SubscriptionContext';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const { subscription, setSubscription, loading: subLoading } = useSubscription();

    useEffect(() => {
        const handlePaypalSuccess = async () => {
            if (searchParams.get('payment_success') === 'true' && searchParams.get('provider') === 'paypal') {
                const token = searchParams.get('token'); // PayPal's order ID
                if (token) {
                    try {
                        const { success, planName } = await capturePayPalOrder(token);
                        if (success) {
                            toast({
                                title: 'Payment Successful!',
                                description: `Welcome to the ${planName} plan!`,
                            });
                             // Manually update the subscription context
                            setSubscription({
                                planName: planName,
                                status: 'active',
                                paypalOrderId: token,
                            });
                        }
                    } catch (error: any) {
                        toast({
                            variant: 'destructive',
                            title: 'Payment Failed',
                            description: error.message || 'There was an issue processing your payment.',
                        });
                    } finally {
                        // Clean up URL to avoid re-triggering
                        router.replace('/dashboard', { scroll: false });
                    }
                }
            }
        };

        handlePaypalSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);
    
    useEffect(() => {
        // If subscription is loaded and it's not active, redirect to payment page.
        if (!subLoading && (!subscription || subscription.status !== 'active')) {
            router.replace('/onboarding?step=subscribe');
        }
    }, [subscription, subLoading, router]);

    if (subLoading || !subscription || subscription.status !== 'active') {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="flex-1 p-4 h-full">
                <ChatMain />
            </div>
        </AppLayout>
    );
}


export default function DashboardPage() {
    return (
        <Suspense>
            <DashboardContent />
        </Suspense>
    )
}
