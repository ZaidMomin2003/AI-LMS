
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserSubscription } from '@/types';

/**
 * Handles validation and application of a school invite code.
 * Can be used in two modes:
 * 1. Pre-validation (user is null): Checks if the code is valid and has licenses.
 * 2. Finalization (user is provided): Associates the user with the school and updates licenses.
 * @param user The Firebase user object, or null for pre-validation.
 * @param inviteCode The invite code provided by the user.
 * @param isFinalStep A flag to indicate if this is the final step of registration.
 * @returns An object indicating success, a message, and the school's name.
 */
export async function handleSchoolInvite(
  user: User | null,
  inviteCode: string,
  isFinalStep: boolean = false
): Promise<{ success: boolean; message: string; schoolName?: string }> {
  if (!isFirebaseEnabled || !db) {
    return { success: false, message: 'Database is not configured.' };
  }
  if (!inviteCode?.trim()) {
    return { success: false, message: 'An invite code is required.' };
  }

  const schoolsRef = collection(db, 'schools');
  const q = query(schoolsRef, where('inviteCode', '==', inviteCode.trim().toUpperCase()));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'This invite code is not valid. Please check and try again.' };
    }

    const schoolDoc = querySnapshot.docs[0];
    const schoolData = schoolDoc.data();

    if (schoolData.usedLicenses >= schoolData.totalLicenses) {
      return { success: false, message: 'This invite code has reached its maximum number of uses.' };
    }

    // If this is just a pre-validation check before user creation, we're done.
    if (!isFinalStep || !user) {
      return { success: true, message: 'Invite code is valid.', schoolName: schoolData.name };
    }

    // --- Final Step Logic ---
    // All checks passed, let's update the documents in a transaction (batch write)
    const batch = writeBatch(db);

    // 1. Update the school's license count
    const schoolDocRef = schoolDoc.ref;
    batch.update(schoolDocRef, { usedLicenses: schoolData.usedLicenses + 1 });

    // 2. Update the user's document with subscription and school ID
    const proSubscription: UserSubscription = {
      planName: 'Annual Pro',
      status: 'active',
    };
    const userUpdateData = {
      schoolId: schoolDoc.id,
      subscription: proSubscription,
    };
    
    const userDocRef = doc(db, 'users', user.uid);
    batch.set(userDocRef, userUpdateData, { merge: true });

    await batch.commit();

    return { success: true, message: `Successfully joined ${schoolData.name}! Your account has been upgraded.`, schoolName: schoolData.name };

  } catch (error) {
    console.error('Error handling school invite:', error);
    return { success: false, message: 'An unexpected error occurred while applying the invite code.' };
  }
}
