
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { partnerChatFlow, type PartnerChatInput, type PartnerChatOutput } from '@/ai/flows/partner-chat-flow';
import { z } from 'zod';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

// Generates a unique, readable invite code
const generateInviteCode = () => {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', 8);
    return nanoid();
};

const SchoolSignUpSchema = z.object({
  schoolName: z.string().min(3, 'School name is required.'),
  adminEmail: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export async function createSchoolAccountAction(
  values: unknown
): Promise<{ success: boolean; message: string }> {
  // 1. Validate input data
  const result = SchoolSignUpSchema.safeParse(values);
  if (!result.success) {
    const errorMessages = result.error.errors.map(e => e.message).join(', ');
    return { success: false, message: `Invalid form data: ${errorMessages}` };
  }

  // This check is important for production readiness
  if (!isFirebaseEnabled || !db) {
    return { success: false, message: 'The database is not configured. Please contact support.' };
  }

  const { schoolName, adminEmail, password } = result.data;

  try {
    // 2. Check if a school with this email already exists
    const schoolsRef = collection(db, 'schools');
    const q = query(schoolsRef, where('adminEmail', '==', adminEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return { success: false, message: 'An account with this email already exists. Please log in instead.' };
    }

    // 3. Securely hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new school document in Firestore
    const newSchoolRef = await addDoc(collection(db, 'schools'), {
      name: schoolName,
      adminEmail: adminEmail,
      hashedPassword: hashedPassword,
      totalLicenses: 100, // Assign a default of 100 licenses to start
      usedLicenses: 0,
      inviteCode: generateInviteCode(),
      createdAt: serverTimestamp(),
    });

    // 5. Set a secure cookie to log the user in immediately
    cookies().set('school-session', newSchoolRef.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day session
      path: '/',
    });

    return { success: true, message: 'Account created successfully! Redirecting...' };
  } catch (error) {
    console.error('Error creating school account:', error);
    // This will now catch Firestore permission errors if rules are incorrect
    return { success: false, message: 'A server error occurred. Please ensure Firestore rules are set correctly and try again.' };
  }
}


export async function partnerChatAction(input: PartnerChatInput): Promise<PartnerChatOutput> {
    try {
        return await partnerChatFlow(input);
    } catch (error) {
        console.error('Error in Partner Chat action:', error);
        throw new Error('Failed to get a response from the AI.');
    }
}
