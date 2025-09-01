
'use server';

import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/firebase';
import { headers } from 'next/headers';

interface CreateCheckoutSessionInput {
  priceId: string;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<{ sessionId: string }> {
  const user = auth.currentUser;
  
  if (!user) {
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
      client_reference_id: user.uid, // Pass the user's UID to identify them in webhooks
    });

    if (!session.id) {
        throw new Error('Could not create Stripe checkout session.');
    }

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create checkout session.');
  }
}
