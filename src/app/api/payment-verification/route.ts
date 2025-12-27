
'use server';

import { config } from 'dotenv';
config();

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminDB } from '@/lib/firebase-admin';

async function getUserIdFromOrderId(orderId: string): Promise<string | null> {
    const db = getAdminDB();
    if (!db) return null;
    const orderDocRef = db.collection('orders').doc(orderId);
    try {
        const orderDoc = await orderDocRef.get();
        if (orderDoc.exists) {
            return orderDoc.data()?.userId;
        }
    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
    }
    return null;
}

async function updateUserSubscription(uid: string, data: object): Promise<boolean> {
    const db = getAdminDB();
    if (!uid || !db) return false;
    try {
        const userDocRef = db.collection('users').doc(uid);
        await userDocRef.set({ subscription: data }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating user subscription: ", error);
        return false;
    }
};

function getPlanNameFromDuration(durationDays: number): string {
    if (durationDays === 7) return 'Weekly Pass';
    if (durationDays === 365) return 'Sage Mode';
    if (durationDays >= 3650) return 'Lifetime Sage'; // For 10 years or more
    return `${durationDays}-day Pass`;
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const razorpay_order_id = formData.get('razorpay_order_id') as string;
    const razorpay_payment_id = formData.get('razorpay_payment_id') as string;
    const razorpay_signature = formData.get('razorpay_signature') as string;
    const planDurationDays = parseInt(formData.get('plan_duration_days') as string || '0', 10);
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planDurationDays) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
        const userId = await getUserIdFromOrderId(razorpay_order_id);
        if (!userId) {
            console.error(`Could not find userId for orderId: ${razorpay_order_id}`);
            // Redirect to a failure page but don't expose user not found
            const failureUrl = new URL('/dashboard/pricing?success=false&error=order_validation_failed', req.nextUrl.origin);
            return NextResponse.redirect(failureUrl.toString());
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + planDurationDays);

        const planName = getPlanNameFromDuration(planDurationDays);

        await updateUserSubscription(userId, {
            plan: planName,
            status: 'active',
            expiryDate: expiryDate.toISOString(),
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });

        // Redirect to a success page
        const successUrl = new URL('/dashboard?payment=success', req.nextUrl.origin);
        return NextResponse.redirect(successUrl.toString());

    } else {
      // Redirect to a failure page
      const failureUrl = new URL('/dashboard/pricing?success=false&error=signature_mismatch', req.nextUrl.origin);
      return NextResponse.redirect(failureUrl.toString());
    }
  } catch (error: any) {
    console.error("Error in payment verification:", error);
    const failureUrl = new URL(`/dashboard/pricing?success=false&error=${encodeURIComponent(error.message)}`, req.nextUrl.origin);
    return NextResponse.redirect(failureUrl.toString());
  }
}
