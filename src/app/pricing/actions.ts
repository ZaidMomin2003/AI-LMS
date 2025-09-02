'use server';

import paypalClient from '@/lib/paypal';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { updateUserDoc } from '@/services/firestore';
import type { SubscriptionPlan, UserSubscription } from '@/types';
import { auth } from '@/lib/firebase';

interface PaypalOrder {
  price: string;
  name: SubscriptionPlan;
}

export async function createPaypalOrder(plan: PaypalOrder) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: plan.price,
        },
        description: `Wisdomis Fun - ${plan.name}`,
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    return { orderID: order.result.id };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown PayPal error';
    return { error: `Could not create order: ${errorMessage}` };
  }
}


export async function capturePaypalOrder(orderID: string, planName: SubscriptionPlan) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({} as any); // The SDK type is incorrect, it requires a body but the API doesn't.

  try {
    const capture = await paypalClient.execute(request);
    const capturedOrder = capture.result;
    
    // Check if the payment was successful
    if (capturedOrder.status === 'COMPLETED') {
        const user = auth?.currentUser;
        if (!user) {
            throw new Error('User is not authenticated. Cannot update subscription.');
        }

        const subscriptionData: UserSubscription = {
            planName: planName,
            status: 'active',
            paypalOrderId: capturedOrder.id,
        };

        // Update user document in Firestore with the new subscription
        await updateUserDoc(user.uid, { subscription: subscriptionData });
        
        return { success: true, order: capturedOrder };
    } else {
        // Handle other statuses like 'PENDING' if necessary
        return { error: 'Payment not completed.', order: capturedOrder };
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown PayPal error';
    return { error: `Could not capture payment: ${errorMessage}` };
  }
}
