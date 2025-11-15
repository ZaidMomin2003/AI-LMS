
'use server';

import 'dotenv/config';
import Razorpay from 'razorpay';
import { updateUserDoc } from '@/services/firestore';
import type { UserSubscription } from '@/types';
import { isFirebaseEnabled } from '@/lib/firebase';

export async function createRazorpayOrder(amount: number, uid: string, priceId: string) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured on the server.');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
        // important notes for server-to-server verification
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

export async function downgradeToHobbyAction(uid: string): Promise<{ success: boolean }> {
    if (!uid || !isFirebaseEnabled) {
        return { success: false };
    }
    
    const hobbySubscription: UserSubscription = {
        planName: 'Hobby',
        status: 'active',
    };

    try {
        await updateUserDoc(uid, { subscription: hobbySubscription });
        return { success: true };
    } catch (error) {
        console.error("Error downgrading to Hobby plan:", error);
        return { success: false };
    }
}
