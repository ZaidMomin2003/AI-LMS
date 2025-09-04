
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { updateUserDoc } from './firestore';
import type { User } from 'firebase/auth';
import type { UserSubscription } from '@/types';

/**
 * Handles the logic for a user signing up with a school invite code.
 * @param user The Firebase user object.
 * @param inviteCode The invite code provided by the user.
 * @returns An object indicating success and a message.
 */
export async function handleSchoolInvite(
  user: User,
  inviteCode: string
): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseEnabled || !db) {
    return { success: false, message: 'Database is not configured.' };
  }
  if (!inviteCode?.trim()) {
    // This case should be handled by the form, but as a fallback.
    return { success: false, message: 'No invite code provided.' };
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
    
    // We can't use our updateUserDoc here because we need the doc ref for the batch
    const userDocRef = doc(db, 'users', user.uid);
    batch.set(userDocRef, userUpdateData, { merge: true });

    await batch.commit();

    return { success: true, message: `Successfully joined ${schoolData.name}! Your account has been upgraded.` };

  } catch (error) {
    console.error('Error handling school invite:', error);
    return { success: false, message: 'An unexpected error occurred while applying the invite code.' };
  }
}
