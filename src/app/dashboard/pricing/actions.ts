
'use server';

import { getAdminDB } from '@/lib/firebase-admin';

export async function applyCouponAction(code: string, uid: string): Promise<{ success: boolean, message: string }> {
  const db = getAdminDB();
  if (!db) {
    return { success: false, message: 'Server error: Cannot connect to the database.' };
  }

  // Check if the coupon code is valid
  if (code.toUpperCase() !== 'FIRST25') {
    return { success: false, message: 'This coupon code is not valid.' };
  }

  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    // Check if user already has an active subscription
    if (userDoc.exists && userDoc.data()?.subscription?.status === 'active') {
        return { success: false, message: 'Coupon cannot be applied to an already active subscription.' };
    }

    // Set the subscription expiry date to 2 months from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 2);

    const subscriptionData = {
      plan: 'FIRST25 Trial',
      status: 'active',
      expiryDate: expiryDate.toISOString(),
    };

    await userDocRef.set({ subscription: subscriptionData }, { merge: true });
    
    return { success: true, message: 'Success! Your 2-month trial has been activated.' };

  } catch (error) {
    console.error('Error applying coupon:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}
