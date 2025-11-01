
'use server';

import 'dotenv/config';
import { isFirebaseEnabled } from '@/lib/firebase';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { updateUserDoc } from '@/services/firestore';
import type { UserSubscription } from '@/types';

export async function createRazorpayOrder(amount: number, uid: string) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
        uid: uid,
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

interface PaymentVerificationData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    uid: string;
}

export async function verifyRazorpayPayment(data: PaymentVerificationData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, uid } = data;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic && isFirebaseEnabled) {
        // Payment is authentic, update user's subscription in Firestore
        const subscriptionData: UserSubscription = {
            planName: 'Sage Mode',
            status: 'active',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        };
        await updateUserDoc(uid, { subscription: subscriptionData });
        return { success: true, message: "Payment verified successfully." };
    }

    return { success: false, message: "Payment verification failed." };
}
