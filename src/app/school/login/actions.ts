
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().optional(), // Password can be optional for Google Sign-In flow
});

interface ActionResult {
  success: boolean;
  message: string;
}

export async function schoolLoginAction(credentials: unknown): Promise<ActionResult> {
  const result = LoginSchema.safeParse(credentials);
  if (!result.success) {
    const errorMessages = result.error.errors.map(e => e.message).join(', ');
    return { success: false, message: `There was an issue with your submission: ${errorMessages}` };
  }

  const { email, password } = result.data;

  if (!isFirebaseEnabled || !db) {
    return { success: false, message: 'The database is not connected. Please contact support.' };
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

    // Scenario 1: User is trying to log in with an email and password.
    if (password) {
        // Check if the account was created with Google (no password).
        if (!schoolData.hashedPassword) {
          return { success: false, message: 'This account uses Google Sign-In. Please use the "Sign In with Google" button instead.' };
        }
        // Check if the provided password is correct.
        const isPasswordValid = await bcrypt.compare(password, schoolData.hashedPassword);
        if (!isPasswordValid) {
            return { success: false, message: 'The password you entered is incorrect. Please try again.' };
        }
    // Scenario 2: User is logging in with Google (no password provided to this action).
    } else {
        // Check if the account was created with a password.
        if (schoolData.hashedPassword) {
            return { success: false, message: 'This account uses an email and password. Please sign in using your password.' };
        }
    }

    // If all checks pass, set the session cookie.
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
