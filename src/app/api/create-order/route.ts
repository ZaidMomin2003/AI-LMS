
'use server';

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { isFirebaseEnabled, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json({ error: 'Razorpay credentials are not configured.' }, { status: 500 });
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
            amount: amount * 100, // Amount in the smallest currency unit
            currency: 'USD',
            receipt: `receipt_user_${userId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        
        if (isFirebaseEnabled && db) {
            const orderDocRef = doc(db, 'orders', order.id);
            await setDoc(orderDocRef, { 
                userId, 
                amount: order.amount,
                createdAt: new Date().toISOString()
            });
        }
        
        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Could not create a payment order.' }, { status: 500 });
    }
}
