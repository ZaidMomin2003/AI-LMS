import {NextRequest, NextResponse} from 'next/server';
import {headers} from 'next/headers';
import Stripe from 'stripe';
import {stripe} from '@/lib/stripe';
import {updateUserDoc} from '@/services/firestore';
import type {UserSubscription} from '@/types';
import {buffer} from 'micro';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  const buf = await buffer(req.body!);
  const sig = headers().get('Stripe-Signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json({error: `Webhook Error: ${errorMessage}`}, {status: 400});
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'customer.subscription.deleted',
    'customer.subscription.updated',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 Checkout session completed for user: ${data.client_reference_id}`);
          const subscription = await stripe.subscriptions.retrieve(data.subscription as string);
          await handleSubscriptionChange(data.client_reference_id!, subscription);
          break;
        case 'customer.subscription.deleted':
          data = event.data.object as Stripe.Subscription;
          console.log(`💀 Subscription deleted for customer: ${data.customer}`);
          await handleSubscriptionChange(data.id, data, true);
          break;
        case 'customer.subscription.updated':
          data = event.data.object as Stripe.Subscription;
          console.log(`📈 Subscription updated for customer: ${data.customer}`);
          await handleSubscriptionChange(data.id, data);
          break;
        default:
          console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return NextResponse.json({error: 'Webhook handler failed'}, {status: 500});
    }
  }

  return NextResponse.json({received: true});
}

const getPlanName = (priceId: string): UserSubscription['planName'] => {
  switch (priceId) {
    case 'price_1RiJCmRsI0LGhGhHY7V3VcWp': // Replace with your actual price IDs
      return 'Rapid Student';
    case 'price_1RiJCjRsI0LGhGhHmmDzBMCk':
      return 'Scholar Subscription';
    case 'price_1RiJCeRsI0LGhGhHhZXB4MEg':
      return 'Sage Mode';
    default:
      return 'Hobby';
  }
}

const handleSubscriptionChange = async (
  clientReferenceId: string,
  subscription: Stripe.Subscription,
  isDeletion: boolean = false
) => {
  const uid = clientReferenceId; // Assuming client_reference_id is the user's UID

  if (!uid) {
    console.error('No UID found in webhook data');
    return;
  }
  
  const priceId = subscription.items.data[0].price.id;

  const subscriptionData: UserSubscription = {
    planName: isDeletion ? 'Hobby' : getPlanName(priceId),
    status: isDeletion ? 'inactive' : subscription.status,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
  };

  await updateUserDoc(uid, {subscription: subscriptionData});
};
