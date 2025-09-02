
'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import paypalClient from '@/lib/paypal';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { updateUserDoc } from '@/services/firestore';
import type { UserSubscription, SubscriptionPlan } from '@/types';

interface CreateCheckoutSessionInput {
  priceId: string;
  uid: string;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<{ session: Stripe.Checkout.Session | null; error?: string }> {
  const { priceId, uid } = input;

  if (!uid) {
    throw new Error('You must be logged in to subscribe.');
  }

  const origin = headers().get('origin') || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: input.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard`,
      cancel_url: `${origin}/pricing`,
      client_reference_id: uid,
    });

    if (!session.url) {
      return { session: null, error: 'Could not create Stripe checkout session.' };
    }

    return { session };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create checkout session.');
  }
}

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
    
    if (captureResult.status === 'COMPLETED' || captureResult.status === 'APPROVED') {
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
