
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

export interface School {
  id: string;
  name: string;
  adminEmail: string;
  totalLicenses: number;
  usedLicenses: number;
  inviteCode: string;
  createdAt: string;
}

export interface NewSchoolData {
    name: string;
    adminEmail: string;
    totalLicenses: number;
}

// Generates a unique, readable invite code
const generateInviteCode = () => {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', 8);
    return nanoid(); // e.g., 'A4R2-Y7X9'
};

export async function createSchool(data: NewSchoolData): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseEnabled || !db) {
    console.error('Firebase not configured. School cannot be created.');
    return { success: false, message: 'Firebase is not configured.' };
  }

  try {
    await addDoc(collection(db, 'schools'), {
      name: data.name,
      adminEmail: data.adminEmail,
      totalLicenses: data.totalLicenses,
      usedLicenses: 0,
      inviteCode: generateInviteCode(),
      createdAt: serverTimestamp(),
    });
    return { success: true, message: 'School created successfully.' };
  } catch (error) {
    console.error('Error creating school:', error);
    return { success: false, message: 'Could not create school. Please try again later.' };
  }
}

export async function fetchSchools(): Promise<School[]> {
  if (!isFirebaseEnabled || !db) {
    console.warn('Firebase not configured, returning empty schools list.');
    return [];
  }

  try {
    const schoolsRef = collection(db, 'schools');
    const q = query(schoolsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const schools = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        adminEmail: data.adminEmail,
        totalLicenses: data.totalLicenses,
        usedLicenses: data.usedLicenses,
        inviteCode: data.inviteCode,
        createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
      };
    });
    
    return schools;
  } catch (error: any) {
    console.error('Error fetching schools:', error);
    if (error.code === 'failed-precondition') {
        console.error("Firestore Error: This query requires an index. Please check the console logs for a link to create it automatically.");
    }
    return [];
  }
}
