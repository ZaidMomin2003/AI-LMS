
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

interface ActionResult {
  success: boolean;
  message: string;
}

export async function schoolLoginAction(credentials: unknown): Promise<ActionResult> {
  const result = LoginSchema.safeParse(credentials);
  if (!result.success) {
    return { success: false, message: 'Please enter a valid email and password.' };
  }

  const { email, password } = result.data;

  if (!isFirebaseEnabled || !db) {
    // Fallback for demo mode if Firebase isn't configured.
    if (email) {
        cookies().set('school-session', 'demo-school-id', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        return { success: true, message: 'Login successful! Redirecting...' };
    }
    return { success: false, message: 'Application is in demo mode. Firebase is not configured.' };
  }

  try {
    const schoolsRef = collection(db, 'schools');
    const q = query(schoolsRef, where('adminEmail', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'No school account was found with that email address.' };
    }
    
    const schoolDoc = querySnapshot.docs[0];
    const schoolData = schoolDoc.data();

    if (!schoolData.hashedPassword) {
      // This case might occur for manually added schools without a password
      return { success: false, message: 'This account may have been set up differently. Please contact support.' };
    }
    
    const isPasswordValid = await bcrypt.compare(password, schoolData.hashedPassword);
    if (!isPasswordValid) {
        return { success: false, message: 'The password you entered is incorrect. Please try again.' };
    }
    
    const schoolId = schoolDoc.id;
    cookies().set('school-session', schoolId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return { success: true, message: 'Login successful! Redirecting...' };
  } catch (error) {
    console.error('School login error:', error);
    return { success: false, message: 'A server error occurred. Please try again in a few moments.' };
  }
}
