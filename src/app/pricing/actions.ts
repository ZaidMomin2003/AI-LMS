
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


export async function createCheckoutLink({ priceId }: CreateCheckoutLinkArgs, userEmail: string | null | undefined) {
    if (!paddle) {
        throw new Error('Paddle is not configured. Please check your API keys.');
    }

    if (!userEmail) {
        // This should not happen if called correctly from the client,
        // but it's a critical server-side check.
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
            // For a real app, you might want to pass more details
            // to link the transaction to your internal user ID.
            // customData: {
            //   userId: user.uid,
            // },
        });
        
        if (!transaction.checkout?.url) {
            throw new Error('Failed to create checkout URL from Paddle.');
        }

        return { checkoutUrl: transaction.checkout.url, error: null };
    } catch (error) {
        console.error('Error creating Paddle checkout link:', error);
        // This helps debug issues by logging the actual error from Paddle
        if (error instanceof Error && 'type' in error) {
             const paddleError = error as any;
             console.error('Paddle Error Body:', paddleError.body);
        }
        throw new Error('Could not create payment link. Please try again.');
    }
}
