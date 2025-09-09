
'use server';

import { auth } from '@/lib/firebase';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import type { UserSubscription } from '@/types';
import { updateUserDoc } from '@/services/firestore';
import paypal from '@paypal/checkout-server-sdk';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

const getURL = () => {
  const headersList = headers();
  const host = headersList.get('host');
  return `http://${host}`;
};

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

export async function createStripeCheckoutSession(plan: 'Weekly Pass' | 'Annual Pro') {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const priceId = plan === 'Weekly Pass' 
    ? process.env.STRIPE_WEEKLY_PRICE_ID 
    : process.env.STRIPE_ANNUAL_PRICE_ID;

  if (!priceId) {
    throw new Error('Stripe price ID is not configured.');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${getURL()}/dashboard?payment_success=true`,
      cancel_url: `${getURL()}/dashboard/subscription`,
      customer_email: user.email ?? undefined,
      metadata: {
        userId: user.uid,
        planName: plan,
      }
    });

    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error('Could not create Stripe session.');
    }
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw new Error('An error occurred while setting up your payment.');
  }
}

export async function createPayPalOrder(plan: 'Weekly Pass' | 'Annual Pro') {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User is not authenticated.');
    }
    
    const price = plan === 'Weekly Pass' ? '7.00' : '49.00';
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: price,
            },
            description: `Wisdomis Fun - ${plan}`,
            custom_id: JSON.stringify({ userId: user.uid, planName: plan }),
        }],
        application_context: {
            brand_name: 'Wisdomis Fun',
            landing_page: 'LOGIN',
            user_action: 'PAY_NOW',
            return_url: `${getURL()}/dashboard?payment_success=true`,
            cancel_url: `${getURL()}/dashboard/subscription`,
        }
    });

    try {
        const order = await client.execute(request);
        return { orderID: order.result.id };
    } catch (err) {
        console.error('Error creating PayPal order:', err);
        throw new Error('Could not create PayPal order.');
    }
}


export async function capturePayPalOrder(orderID: string) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User is not authenticated.');
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        
        const purchaseUnit = capture.result.purchase_units[0];
        const customIdData = JSON.parse(purchaseUnit.custom_id);

        if (customIdData.userId !== user.uid) {
            throw new Error("User ID mismatch in PayPal order.");
        }

        const subscription: UserSubscription = {
            planName: customIdData.planName,
            status: 'active',
            paypalOrderId: orderID,
        };

        await updateUserDoc(user.uid, { subscription });

        return { success: true };
    } catch (err) {
        console.error('Error capturing PayPal order:', err);
        throw new Error('Payment could not be processed.');
    }
}
