
'use server';

import 'dotenv/config';
import { db, isFirebaseEnabled } from '@/lib/firebase';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { updateUserDoc } from '@/services/firestore';
import type { UserSubscription } from '@/types';

export async function createRazorpayOrder(amount: number, uid: string, priceId: string) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured on the server.');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Amount in the smallest currency unit (e.g., paise for INR)
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
        uid: uid,
        priceId: priceId,
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
        id: order.id,
        currency: order.currency,
        amount: order.amount
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Could not create Razorpay order.');
  }
}


interface VerificationData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    uid: string;
    priceId: string;
}

export async function verifyRazorpayPayment(data: VerificationData): Promise<{ success: boolean; message: string }> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, uid, priceId } = data;
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        return { success: false, message: 'Signature verification failed.' };
    }

    if (!isFirebaseEnabled) {
        return { success: false, message: 'Firebase is not configured.' };
    }
    
    // Signature is valid, update user subscription in Firestore
    const planDurations: Record<string, number> = {
        SAGE_MODE_YEARLY: 365,
        SAGE_MODE_6_MONTHS: 180,
        SAGE_MODE_3_MONTHS: 90,
    };
    
    const durationInDays = planDurations[priceId];
    if (!durationInDays) {
        return { success: false, message: `Invalid priceId: ${priceId}` };
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationInDays);

    const subscriptionData: UserSubscription = {
        planName: "Sage Mode",
        status: "active",
        priceId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        expiresAt: expiresAt.toISOString(),
    };

    try {
        await updateUserDoc(uid, { subscription: subscriptionData });
        return { success: true, message: 'Subscription updated successfully.' };
    } catch (error) {
        console.error("Error updating user subscription in Firestore:", error);
        return { success: false, message: 'Failed to update subscription in the database.' };
    }
}
