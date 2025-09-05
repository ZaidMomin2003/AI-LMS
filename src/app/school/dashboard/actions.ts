
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface SchoolData {
  id: string;
  name: string;
  adminEmail: string;
  totalLicenses: number;
  usedLicenses: number;
  inviteCode: string;
}

export interface SchoolUser {
    id: string; // This is the user's UID
    displayName: string | null;
    email: string | null;
    createdAt: string;
}

/**
 * Fetches the school data and its associated users based on the session cookie.
 * This action is called on the server to load initial data for the dashboard.
 */
export async function getSchoolDataForDashboard(): Promise<{
  school: SchoolData | null;
  users: SchoolUser[];
  error?: string;
}> {
  const schoolId = cookies().get('school-session')?.value;
  if (!schoolId) {
    redirect('/school/login');
  }

  if (!isFirebaseEnabled || !db) {
    return { school: null, users: [], error: 'Database is not configured.' };
  }

  try {
    // 1. Fetch School Data
    const schoolDocRef = doc(db, 'schools', schoolId);
    const schoolDocSnap = await getDoc(schoolDocRef);

    if (!schoolDocSnap.exists()) {
      return { school: null, users: [], error: 'School not found.' };
    }
    const schoolData = schoolDocSnap.data();
    const school: SchoolData = {
        id: schoolDocSnap.id,
        name: schoolData.name,
        adminEmail: schoolData.adminEmail,
        totalLicenses: schoolData.totalLicenses,
        usedLicenses: schoolData.usedLicenses,
        inviteCode: schoolData.inviteCode,
    }

    // 2. Fetch Users associated with the school
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('schoolId', '==', schoolId));
    const usersSnapshot = await getDocs(q);
    
    const users = usersSnapshot.docs.map(userDoc => {
        const data = userDoc.data();
        return {
            id: userDoc.id,
            displayName: data.displayName || 'N/A',
            email: data.email || 'N/A',
            createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
        }
    });

    return { school, users };
  } catch (error) {
    console.error('Error fetching school data:', error);
    return { school: null, users: [], error: 'An unexpected error occurred.' };
  }
}


export async function removeUserFromSchool(userId: string): Promise<{success: boolean, message: string}> {
    const schoolId = cookies().get('school-session')?.value;
    if (!schoolId) {
        return { success: false, message: 'Authentication error. Please log in again.' };
    }

    if (!isFirebaseEnabled || !db) {
        return { success: false, message: 'Database not configured.' };
    }

    try {
        const batch = writeBatch(db);

        // 1. Remove schoolId and subscription from the user's document
        const userDocRef = doc(db, 'users', userId);
        batch.update(userDocRef, {
            schoolId: null,
            subscription: null,
        });

        // 2. Decrement the usedLicenses count on the school document
        const schoolDocRef = doc(db, 'schools', schoolId);
        const schoolDocSnap = await getDoc(schoolDocRef);
        if (schoolDocSnap.exists()) {
            const currentLicenses = schoolDocSnap.data().usedLicenses || 0;
            batch.update(schoolDocRef, { usedLicenses: Math.max(0, currentLicenses - 1) });
        } else {
            throw new Error("School document not found.");
        }

        await batch.commit();

        return { success: true, message: "User removed and license freed up." };

    } catch (error) {
        console.error("Error removing user:", error);
        return { success: false, message: "Failed to remove user." };
    }
}
