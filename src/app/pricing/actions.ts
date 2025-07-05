
'use server';

import { paddle } from '@/lib/paddle';
import type { ErrorResponse } from '@paddle/paddle-node-sdk/dist/types/errors/error-response.js';

interface CreateCheckoutLinkArgs {
    priceId: string;
}

export async function createCheckoutLink(
    { priceId }: CreateCheckoutLinkArgs, 
    userEmail: string | null | undefined
): Promise<{ transactionId?: string; error?: string }> {
    if (!paddle) {
        return { error: 'Paddle is not configured. Please check your API keys.' };
    }

    if (!userEmail) {
        return { error: 'User is not authenticated.' };
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
        return { error: 'Application URL is not configured. Please set NEXT_PUBLIC_APP_URL in your environment variables.' };
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pricing`;
    
    try {
        const transaction = await paddle.transactions.create({
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

        if (transaction.id) {
            return { transactionId: transaction.id };
        } else {
            return { error: 'Paddle did not return a transaction ID.' };
        }
        
    } catch (error) {
        console.error('Error creating Paddle transaction:', error);
        
        let errorMessage = 'An unknown error occurred while creating the transaction.';
        
        const paddleError = error as ErrorResponse;
        if (paddleError?.error) {
            errorMessage = `Paddle Error: ${paddleError.error.detail || paddleError.error.type}`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        return { error: errorMessage };
    }
}
