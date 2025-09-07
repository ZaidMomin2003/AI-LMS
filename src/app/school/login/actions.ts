
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const LoginSchema = z.object({
  email: z.string().email(),
  // Password can be optional if it's a Google Sign-In flow
  password: z.string().optional(),
});

interface ActionResult {
  success: boolean;
  message: string;
}

export async function schoolLoginAction(credentials: unknown): Promise<ActionResult> {
  const result = LoginSchema.safeParse(credentials);
  if (!result.success) {
    return { success: false, message: 'Invalid input format.' };
  }

  const { email, password } = result.data;

  if (!isFirebaseEnabled || !db) {
    return { success: false, message: 'Database is not configured.' };
  }

  try {
    const schoolsRef = collection(db, 'schools');
    const q = query(schoolsRef, where('adminEmail', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'Invalid email or password.' };
    }
    
    const schoolDoc = querySnapshot.docs[0];
    const schoolData = schoolDoc.data();

    // If a password is provided, it's an email/pass login. We must validate it.
    if (password) {
        if (!schoolData.hashedPassword) {
          // This account was likely created with Google and has no password.
          return { success: false, message: 'This account uses Google Sign-In. Please log in with Google.' };
        }

        const isPasswordValid = await bcrypt.compare(password, schoolData.hashedPassword);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid email or password.' };
        }
    } else {
        // If no password, this is a Google Sign-In flow. 
        // We trust the authentication has already happened on the client.
        // We've found the school by email, so we can proceed.
        // If the account has a password, it means it wasn't created with Google.
        if (schoolData.hashedPassword) {
            return { success: false, message: 'This account uses an email and password. Please sign in with your password.' };
        }
    }


    const schoolId = schoolDoc.id;

    // Set a secure, httpOnly cookie to manage the session
    cookies().set('school-session', schoolId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return { success: true, message: 'Login successful.' };
  } catch (error) {
    console.error('School login error:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}
