'use server';

import Razorpay from 'razorpay';
import { isFirebaseEnabled, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CreateOrderOptions {
    amount: number;
    userId: string;
}

export async function createOrder({ amount, userId }: CreateOrderOptions) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay credentials are not configured.');
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // Amount in the smallest currency unit (e.g., cents for USD)
        currency: 'USD', // Strictly use USD
        receipt: `receipt_user_${userId}_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        
        // Store the order details with the user ID in Firestore
        if (isFirebaseEnabled && db) {
            const orderDocRef = doc(db, 'orders', order.id);
            await setDoc(orderDocRef, { 
                userId, 
                amount: order.amount,
                createdAt: new Date().toISOString()
            });
        }
        
        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency
        };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw new Error('Could not create a payment order.');
    }
}
