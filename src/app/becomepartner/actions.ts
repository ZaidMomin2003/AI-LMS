
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
  const result = SchoolSignUpSchema.safeParse(values);
  if (!result.success) {
    const errorMessages = result.error.errors.map(e => e.message).join(', ');
    return { success: false, message: `Invalid form data: ${errorMessages}` };
  }
  
  // For the demo, we can bypass Firebase checks and just set a cookie
  if (!isFirebaseEnabled || !db) {
     cookies().set('school-session', 'demo-school-id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true, message: 'School account created successfully!' };
  }

  const { schoolName, adminEmail, password } = result.data;

  try {
    // 1. Check if a school with this email already exists
    const schoolsRef = collection(db, 'schools');
    const q = query(schoolsRef, where('adminEmail', '==', adminEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return { success: false, message: 'An account with this email already exists. Please use a different email or log in.' };
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. If email is unique, create the new school account
    const newSchoolRef = await addDoc(collection(db, 'schools'), {
      name: schoolName,
      adminEmail: adminEmail,
      hashedPassword: hashedPassword,
      totalLicenses: 100, // Assign a default of 100 licenses
      usedLicenses: 0,
      inviteCode: generateInviteCode(),
      createdAt: serverTimestamp(),
    });

    // 4. Set a session cookie to log the user in
    cookies().set('school-session', newSchoolRef.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true, message: 'School account created successfully!' };
  } catch (error) {
    console.error('Error creating school account:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
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
