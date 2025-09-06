
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { partnerChatFlow, type PartnerChatInput, type PartnerChatOutput } from '@/ai/flows/partner-chat-flow';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';
import { cookies } from 'next/headers';

const SchoolSignUpSchema = z.object({
  schoolName: z.string().min(3, 'School name is required.'),
  adminEmail: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  schoolSize: z.coerce.number().min(1, 'School size must be at least 1.'),
});

// Generates a unique, readable invite code
const generateInviteCode = () => {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', 8);
    return nanoid();
};

export async function createSchoolAccountAction(formData: unknown): Promise<{ success: boolean; message: string }> {
  const result = SchoolSignUpSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  if (!isFirebaseEnabled || !db) {
    return { success: false, message: 'Database is not configured.' };
  }

  const { schoolName, adminEmail, password, schoolSize } = result.data;

  try {
    // In a real app, you'd securely hash the password. For this demo, we store it directly.
    // This is NOT secure for production.
    const newSchoolRef = await addDoc(collection(db, 'schools'), {
      name: schoolName,
      adminEmail: adminEmail,
      password: password, // WARNING: Storing plain text passwords is not secure.
      totalLicenses: schoolSize,
      usedLicenses: 0,
      inviteCode: generateInviteCode(),
      createdAt: serverTimestamp(),
    });

    // Set a session cookie to log the user in
    cookies().set('school-session', newSchoolRef.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true, message: 'School account created successfully!' };
  } catch (error) {
    console.error('Error creating school account:', error);
    // You might want to check for unique email constraints if you set them up in Firestore rules
    return { success: false, message: 'An account with this email may already exist.' };
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
