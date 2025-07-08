
'use server';

import { stripe } from '@/lib/stripe';
import type { Stripe } from 'stripe';

interface CreateCheckoutSessionArgs {
    priceId: string;
}

export async function createStripeCheckoutSession(
    { priceId }: CreateCheckoutSessionArgs, 
    userEmail: string | null | undefined,
    userId: string | undefined
): Promise<{ url?: string; error?: string }> {
    if (!stripe) {
        return { error: 'Stripe is not configured. The server is missing the STRIPE_SECRET_KEY environment variable.' };
    }

    if (!userEmail || !userId) {
        return { error: 'User is not authenticated.' };
    }

    const appUrl = 'https://wisdomis.fun';

    const successUrl = `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: userEmail,
            client_reference_id: userId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        if (session.url) {
            return { url: session.url };
        } else {
            return { error: 'Stripe did not return a session URL.' };
        }
        
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        
        let errorMessage = 'An unknown error occurred while creating the checkout session.';
        
        const stripeError = error as Stripe.errors.StripeError;

        if (stripeError?.code === 'resource_missing') {
            errorMessage = "Stripe Error: A price ID used in the checkout does not exist in your Stripe account's current mode (Live/Test). Please check your Price IDs in the pricing page file and your Stripe dashboard.";
        } else if (stripeError?.message) {
            errorMessage = `Stripe Error: ${stripeError.message}`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        return { error: errorMessage };
    }
}
