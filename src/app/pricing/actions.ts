'use server';

import { paddle } from '@/lib/paddle';

interface CreateCheckoutLinkArgs {
    priceId: string;
}

export async function createCheckoutLink({ priceId }: CreateCheckoutLinkArgs, userEmail: string | null | undefined): Promise<{ url: string } | { error: string }> {
    if (!paddle) {
        return { error: 'Paddle is not configured. Please check your API keys.' };
    }

    if (!userEmail) {
        return { error: 'User is not authenticated.' };
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pricing`;
    let transaction;

    try {
        transaction = await paddle.transactions.create({
            items: [
                {
                    priceId: priceId,
                    quantity: 1,
                },
            ],
            customer: {
                email: userEmail,
            },
            checkout: {
                settings: {
                    successUrl: successUrl,
                    cancelUrl: cancelUrl,
                }
            }
        });
        
    } catch (error) {
        console.error('Error creating Paddle checkout link:', error);
        
        let errorMessage = 'An unknown error occurred while creating the payment link.';
        
        if (error instanceof Error && 'body' in error) {
             const paddleError = error as any;
             console.error('Paddle Error Body:', paddleError.body);
             if (paddleError.body?.error?.detail) {
                 errorMessage = `Paddle Error: ${paddleError.body.error.detail}`;
             }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        return { error: errorMessage };
    }

    if (transaction.checkout?.url) {
        return { url: transaction.checkout.url };
    } else {
        return { error: 'Paddle did not return a checkout URL. Please try again.' };
    }
}
