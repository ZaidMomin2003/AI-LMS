'use server';

import { auth } from '@/lib/firebase';
import { updateUserDoc } from '@/services/firestore';
import paypal from '@paypal/checkout-server-sdk';
import type {
  Order,
  PurchaseUnit,
} from '@paypal/checkout-server-sdk/lib/orders/lib';

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

export async function createPayPalOrder(
  plan: 'Weekly Pass' | 'Annual Pro',
  price?: string
): Promise<{ orderID: string; approvalUrl: string }> {
  const request = new paypal.orders.OrdersCreateRequest();

  const planDetails = {
    'Weekly Pass': { value: '7.00', description: 'Weekly Pass Subscription' },
    'Annual Pro': {
      value: price || '299.00',
      description: 'Annual Pro Subscription',
    },
  };

  const details = planDetails[plan];

  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: details.value,
        },
        description: details.description,
      },
    ],
    application_context: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_success=true&provider=paypal`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
    },
  });

  try {
    const order: Order = await client.execute(request);
    const approvalLink = order.links.find(
      (link) => link.rel === 'approve'
    );
    if (!approvalLink) {
      throw new Error('No approval link found in PayPal response.');
    }
    return { orderID: order.id, approvalUrl: approvalLink.href };
  } catch (error: any) {
    console.error('Error creating PayPal order:', error.message);
    throw new Error('Failed to create PayPal order.');
  }
}

export async function capturePayPalOrder(
  orderID: string
): Promise<{ success: boolean; planName: string }> {
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    const purchaseUnit: PurchaseUnit =
      capture.result.purchase_units?.[0] as PurchaseUnit;

    const planName =
      purchaseUnit.description === 'Weekly Pass Subscription'
        ? 'Weekly Pass'
        : 'Annual Pro';

    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated for capturing order.');
    }

    await updateUserDoc(userId, {
      subscription: {
        planName,
        status: 'active',
        paypalOrderId: orderID,
      },
    });

    return { success: true, planName };
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw new Error('Payment could not be processed.');
  }
}
