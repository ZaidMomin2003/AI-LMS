
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

export async function createPaypalOrder(price: number): Promise<{ orderID: string }> {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: price.toString(),
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    return { orderID: order.result.id };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw new Error('Failed to create PayPal order.');
  }
}

export async function capturePaypalOrder(orderID: string, planName: SubscriptionPlan, uid: string): Promise<{ success: boolean }> {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({}); // Body must be an empty object.

  try {
    const capture = await paypalClient.execute(request);
    
    if (capture.result.status === 'COMPLETED') {
      console.log('PayPal capture successful, updating user subscription...');
      const subscriptionData: UserSubscription = {
        planName,
        status: 'active',
        paypalOrderId: capture.result.id,
      };
      await updateUserDoc(uid, { subscription: subscriptionData });
      console.log('User subscription updated successfully.');
      return { success: true };
    } else {
      console.warn('PayPal capture status was not COMPLETED:', capture.result);
      return { success: false };
    }
  } catch (error: any) {
    // PayPal can throw an error if the order is already captured.
    // This is not a failure from the user's perspective.
    if (error.statusCode === 422 && error.message.includes('ORDER_ALREADY_CAPTURED')) {
        console.warn(`Order ${orderID} was already captured. Treating as success.`);
        // To be safe, we can re-verify the subscription status here.
        const subscriptionData: UserSubscription = { planName, status: 'active', paypalOrderId: orderID };
        await updateUserDoc(uid, { subscription: subscriptionData });
        return { success: true };
    }
    
    console.error('FATAL: Error capturing PayPal order:', error);
    // Log the detailed error message if available
    if (error.message) {
      console.error('PayPal Error Details:', error.message);
    }
    return { success: false };
  }
}
