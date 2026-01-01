
'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function applyCouponAction(code: string, uid: string): Promise<{ success: boolean, message: string, discountedPrice?: { yearly?: number, lifetime?: number } }> {
  const upperCaseCode = code.toUpperCase();

  // Handle special, hardcoded coupons first. These do not need a DB connection.
  if (upperCaseCode === 'TEST1') {
      return { success: true, message: 'TEST1 coupon applied! You can now purchase for a nominal amount.', discountedPrice: { yearly: 0.02, lifetime: 0.02 } };
  }
  
  if (upperCaseCode === 'LEARN2026') {
    return { 
      success: true, 
      message: 'LEARN2026 coupon applied! Special pricing is now available.', 
      discountedPrice: { yearly: 149, lifetime: 499 } 
    };
  }

  // --- All other coupons below this line require a database connection. ---

  const db = getAdminDB();
  if (!db) {
    // This message will now only show for coupons that are NOT the special ones above.
    return { success: false, message: 'Server error: Cannot connect to the database to validate this coupon.' };
  }

  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    // Check if user already has an active subscription
    if (userDoc.exists && userDoc.data()?.subscription?.status === 'active') {
        return { success: false, message: 'Coupon cannot be applied to an already active subscription.' };
    }
    
    // Handle FIRST25 coupon for a free trial
    if (upperCaseCode === 'FIRST25') {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 2);

        const subscriptionData = {
          plan: 'FIRST25 Trial',
          status: 'active',
          expiryDate: expiryDate.toISOString(),
          createdAt: FieldValue.serverTimestamp(),
        };

        await userDocRef.set({ subscription: subscriptionData }, { merge: true });
        
        // Return a success message but no price, as it's a free trial activation.
        return { success: true, message: 'Success! Your 2-month trial has been activated.' };
    }
    
    // If no coupon matches
    return { success: false, message: 'This coupon code is not valid.' };

  } catch (error) {
    console.error('Error applying coupon:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}
