
'use server';

import { updateUserDoc } from '@/services/firestore';
import type { SubscriptionPlan, UserSubscription } from '@/types';
import paypalClient from '@/lib/paypal';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

export async function createPaypalOrder(price: number): Promise<{ orderID?: string; error?: string }> {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: price.toFixed(2),
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    return { orderID: order.result.id };
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    const errorMessage = error.message || 'Failed to create PayPal order.';
    return { error: errorMessage };
  }
}

export async function capturePaypalOrder(orderID: string, planName: SubscriptionPlan, uid: string): Promise<{ success: boolean; error?: string }> {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    const captureResult = capture.result;
    
    if (captureResult.status === 'COMPLETED') {
      const subscriptionData: UserSubscription = {
        planName,
        status: 'active',
        paypalOrderId: captureResult.id,
      };
      await updateUserDoc(uid, { subscription: subscriptionData });
      return { success: true };
    } else {
      console.warn('PayPal capture status was not COMPLETED:', captureResult);
      return { success: false, error: 'Payment was not completed successfully.' };
    }
  } catch (error: any) {
    console.error('Error capturing PayPal order:', error);
     const errorMessage = error.message || 'Failed to finalize PayPal payment.';
    return { success: false, error: errorMessage };
  }
}
