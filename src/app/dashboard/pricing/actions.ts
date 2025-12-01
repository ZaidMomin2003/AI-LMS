
'use server';

import { getAdminDB } from '@/lib/firebase-admin';

export async function applyCouponAction(code: string, uid: string): Promise<{ success: boolean, message: string, discountedPrice?: number }> {
  const db = getAdminDB();
  if (!db) {
    return { success: false, message: 'Server error: Cannot connect to the database.' };
  }

  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    // Check if user already has an active subscription
    if (userDoc.exists && userDoc.data()?.subscription?.status === 'active') {
        return { success: false, message: 'Coupon cannot be applied to an already active subscription.' };
    }
    
    // Handle TEST1 coupon for 1 Rupee (approx $0.02)
    if (code.toUpperCase() === 'TEST1') {
        return { success: true, message: 'TEST1 coupon applied! You can now purchase for a nominal amount.', discountedPrice: 0.02 };
    }

    // Handle FIRST25 coupon for a free trial
    if (code.toUpperCase() === 'FIRST25') {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 2);

        const subscriptionData = {
          plan: 'FIRST25 Trial',
          status: 'active',
          expiryDate: expiryDate.toISOString(),
        };

        await userDocRef.set({ subscription: subscriptionData }, { merge: true });
        
        return { success: true, message: 'Success! Your 2-month trial has been activated.' };
    }
    
    // If no coupon matches
    return { success: false, message: 'This coupon code is not valid.' };

  } catch (error) {
    console.error('Error applying coupon:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}
