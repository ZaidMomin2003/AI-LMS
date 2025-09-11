
'use server';

import 'dotenv/config';
import { auth } from '@/lib/firebase';
import { updateUserDoc } from '@/services/firestore';
import paypal from '@paypal/checkout-server-sdk';
import type {
  Order,
  PurchaseUnit,
} from '@paypal/checkout-server-sdk/lib/orders/lib';


// Helper function to get a configured PayPal client
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('PayPal client ID or secret is not defined in environment variables.');
    // This specific error will be caught and shown to the user.
    throw new Error('PayPal credentials are not configured on the server. Please ensure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set in the .env file.');
  }

  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(environment);
}


export async function createPayPalOrder(
  plan: 'Weekly Pass' | 'Annual Pro',
  price?: string
): Promise<{ orderID: string; approvalUrl: string }> {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL is not set in the environment variables.');
  }
  
  try {
    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();

    const planDetails = {
      'Weekly Pass': { value: '7.00', description: 'Weekly Pass Subscription' },
      'Annual Pro': {
        value: price || '49.00',
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

    const response = await client.execute(request);
    const order: Order = response.result;

    const approvalLink = order.links.find(
      (link) => link.rel === 'approve'
    );
    if (!approvalLink) {
      throw new Error('No approval link found in PayPal response.');
    }
    return { orderID: order.id, approvalUrl: approvalLink.href };
  } catch (error: any) {
    // Log the detailed error to the server console
    console.error('Error creating PayPal order:', JSON.stringify(error, null, 2));
    
    // Pass the specific error message to the client
    if (error.statusCode && error.result && error.result.message) {
      throw new Error(`PayPal API Error: ${error.result.message}`);
    }
    
    // Pass our custom, more informative error message
    throw new Error(error.message || 'Failed to create PayPal order. Check server logs for details.');
  }
}

export async function capturePayPalOrder(
  orderID: string
): Promise<{ success: boolean; planName: string }> {
  const client = getPayPalClient();
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
