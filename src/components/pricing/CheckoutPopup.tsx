
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { createPaypalOrder, capturePaypalOrder } from '@/app/pricing/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { SubscriptionPlan } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { useState } from 'react';

interface CheckoutPopupProps {
  plan: {
    name: SubscriptionPlan;
    price: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutPopup({ plan, isOpen, onClose }: CheckoutPopupProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  const handleCreateOrder = async () => {
    setError(null);
    const res = await createPaypalOrder(plan);
    if (res.error) {
      setError(res.error);
      throw new Error(res.error);
    }
    return res.orderID;
  };

  const handleOnApprove = async (data: any) => {
    const res = await capturePaypalOrder(data.orderID, plan.name);
    if (res.error) {
       toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: res.error,
      });
      setError(res.error);
    } else {
      toast({
        title: 'Payment Successful!',
        description: `Your subscription to the ${plan.name} plan is now active.`,
      });
      router.push('/dashboard');
      onClose();
    }
  };

  if (!paypalClientId) {
      return (
          <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Configuration Error</DialogTitle>
                 </DialogHeader>
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>PayPal Client ID is missing</AlertTitle>
                    <AlertDescription>
                        The application is not configured for payments. Please add `NEXT_PUBLIC_PAYPAL_CLIENT_ID` to your `.env` file.
                    </AlertDescription>
                 </Alert>
              </DialogContent>
          </Dialog>
      )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You are purchasing the <strong>{plan.name}</strong> plan for <strong>${plan.price}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 max-h-[60vh] overflow-y-auto px-1">
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD', intent: 'capture' }}>
                <PayPalButtons
                    style={{ layout: "vertical", color: 'blue' }}
                    createOrder={handleCreateOrder}
                    onApprove={handleOnApprove}
                    onError={(err) => {
                        console.error("PayPal Button Error:", err);
                        setError("An unexpected error occurred with PayPal. Please try again.");
                    }}
                    onCancel={() => {
                        setError("Payment was cancelled. You can try again anytime.");
                    }}
                />
            </PayPalScriptProvider>
        </div>
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
