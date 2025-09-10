
'use server';

// All server actions related to payments have been disabled 
// because the Firebase Admin SDK, which is required for secure user
// authentication on the server, has been removed to resolve a critical error.

export async function createStripeCheckoutSession(plan: 'Weekly Pass' | 'Annual Pro') {
  console.error("Stripe checkout is disabled.");
  throw new Error("Payment processing is temporarily unavailable.");
}

export async function createPayPalOrder(plan: 'Weekly Pass' | 'Annual Pro', price?: string) {
  console.error("PayPal order creation is disabled.");
  throw new Error("Payment processing is temporarily unavailable.");
}


export async function capturePayPalOrder(orderID: string) {
  console.error("PayPal order capture is disabled.");
  throw new Error("Payment processing is temporarily unavailable.");
}
