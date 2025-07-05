
'use server';

import { paddle } from '@/lib/paddle';
import { auth } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import type { User } from 'firebase/auth';

interface CreateCheckoutLinkArgs {
    priceId: string;
}

// Helper function to get the current user
async function getCurrentUser(): Promise<User | null> {
    // Since this is a server action, we don't have the client-side context.
    // A robust way would be to verify an ID token sent from the client.
    // For simplicity here, we'll assume a session management system is in place
    // or rely on a mechanism to get the authenticated user on the server.
    // As we are using Firebase, a proper implementation would involve passing the user's ID token.
    // However, for this step, we are redirecting on the client if not logged in.
    // A server-side check is still crucial for production.
    // For now, this is a placeholder for a more robust server-side session check.
    return auth.currentUser;
}


export async function createCheckoutLink({ priceId }: CreateCheckoutLinkArgs, userEmail: string | null | undefined): Promise<{ checkoutUrl?: string | null; error?: string }> {
    if (!paddle) {
        return { error: 'Paddle is not configured. Please check your API keys.' };
    }

    if (!userEmail) {
        return { error: 'User is not authenticated.' };
    }

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
        });
        
        if (!transaction.checkout?.url) {
            return { error: 'Paddle did not return a checkout URL. Please try again.' };
        }

        return { checkoutUrl: transaction.checkout.url, error: undefined };
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
}
