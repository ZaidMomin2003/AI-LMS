import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateUserDoc } from '@/services/firestore';
import { isFirebaseEnabled } from '@/lib/firebase';
import type { UserSubscription } from '@/types';

export async function POST(req: Request) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    uid,
    priceId,
  } = body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    console.error('Razorpay secret key is not set.');
    return NextResponse.json(
      { success: false, message: 'Server configuration error.' },
      { status: 500 }
    );
  }

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json(
      { success: false, message: 'Invalid payment signature.' },
      { status: 400 }
    );
  }

  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { success: false, message: 'Database service is not available.' },
      { status: 500 }
    );
  }

  const planDurations: Record<string, number> = {
    SAGE_MODE_YEARLY: 365,
    SAGE_MODE_6_MONTHS: 180,
    SAGE_MODE_3_MONTHS: 90,
  };

  const durationInDays = planDurations[priceId];
  if (!durationInDays) {
    return NextResponse.json(
      { success: false, message: 'Invalid plan selected.' },
      { status: 400 }
    );
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationInDays);

  const subscriptionData: UserSubscription = {
    planName: 'Sage Mode',
    status: 'active',
    priceId,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    expiresAt: expiresAt.toISOString(),
  };

  try {
    await updateUserDoc(uid, { subscription: subscriptionData });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Firestore update error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update subscription in database.' },
      { status: 500 }
    );
  }
}
