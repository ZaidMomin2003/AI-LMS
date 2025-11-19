'use server';

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { initializeFirebase } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    // 1. Explicitly check for environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials are not configured in environment variables.');
        return NextResponse.json({ error: 'Payment gateway is not configured on the server.' }, { status: 500 });
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

        // Generate a shorter, unique receipt ID
        const receiptId = `rcpt_${Date.now()}_${userId.slice(0, 8)}`;

        const options = {
            amount: amount * 100, // Amount in the smallest currency unit
            currency: 'USD',
            receipt: receiptId,
        };

        const order = await razorpay.orders.create(options);
        
        const { db, isFirebaseEnabled } = initializeFirebase();
        if (isFirebaseEnabled && db) {
            const orderDocRef = doc(db, 'orders', order.id);
            await setDoc(orderDocRef, { 
                userId, 
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
                createdAt: new Date().toISOString()
            });
        }
        
        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error('[RAZORPAY_CREATE_ORDER_ERROR]', error);
        
        let errorMessage = 'An unknown error occurred while creating the payment order.';
        
        if (typeof error === 'object' && error !== null && 'error' in error) {
            const razorpayError = (error as any).error;
            if (razorpayError && typeof razorpayError === 'object' && 'description' in razorpayError) {
                errorMessage = `Razorpay Error: ${razorpayError.description}`;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
