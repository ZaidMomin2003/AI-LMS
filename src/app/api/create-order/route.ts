
'use server';

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { isFirebaseEnabled, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    // 1. Explicitly check for environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials are not configured in environment variables.');
        return NextResponse.json({ error: 'Razorpay credentials are not configured on the server.' }, { status: 500 });
    }

    try {
        const { amount, userId } = await req.json();

        if (!amount || !userId) {
            return NextResponse.json({ error: 'Amount and userId are required.' }, { status: 400 });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Amount in the smallest currency unit (cents for USD)
            currency: 'USD',
            receipt: `receipt_user_${userId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        
        if (isFirebaseEnabled && db) {
            const orderDocRef = doc(db, 'orders', order.id);
            await setDoc(orderDocRef, { 
                userId, 
                amount: order.amount,
                currency: order.currency,
                createdAt: new Date().toISOString()
            });
        }
        
        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        // 2. Log the specific error from Razorpay
        console.error('Error creating Razorpay order:', error);
        
        let errorMessage = 'Could not create a payment order.';
        // Check if the error object has more details from Razorpay
        if (error instanceof Error && 'error' in error && typeof (error as any).error === 'object') {
             const razorpayError = (error as any).error;
             if (razorpayError.description) {
                errorMessage = `Razorpay Error: ${razorpayError.description}`;
             }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
