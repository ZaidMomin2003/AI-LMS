import Stripe from 'stripe';

// This is a server-side only module.
// Do not import it in client-side code.

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn("Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file to enable payments.");
}

export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    typescript: true,
}) : undefined;
