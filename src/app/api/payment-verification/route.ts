'use server';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getUserIdFromOrderId(orderId: string): Promise<string | null> {
    if (!isFirebaseEnabled || !db) return null;
    const orderDocRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderDocRef);
    if (orderDoc.exists()) {
        return orderDoc.data().userId;
    }
    return null;
}


export async function POST(req: NextRequest) {
  const body = await req.text();
  const data = new URLSearchParams(body);
  const razorpay_order_id = data.get('razorpay_order_id');
  const razorpay_payment_id = data.get('razorpay_payment_id');
  const razorpay_signature = data.get('razorpay_signature');
  const planDuration = parseInt(data.get('plan_duration') || '0', 10);
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planDuration) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
  }

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
        const userId = await getUserIdFromOrderId(razorpay_order_id);
        if (!userId) {
            return NextResponse.json({ error: 'User not found for this order' }, { status: 404 });
        }
        
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + planDuration);

        await updateUserDoc(userId, {
            subscription: {
                plan: `${planDuration}-month`,
                status: 'active',
                expiryDate: expiryDate.toISOString(),
            }
        });

        // Redirect to a success page
        const successUrl = new URL('/dashboard/pricing?success=true', req.nextUrl.origin);
        return NextResponse.redirect(successUrl);

    } catch (error) {
        console.error("Error updating user subscription:", error);
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }
  } else {
    // Redirect to a failure page
    const failureUrl = new URL('/dashboard/pricing?success=false', req.nextUrl.origin);
    return NextResponse.redirect(failureUrl);
  }
}
