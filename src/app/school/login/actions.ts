
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
    
    // In a real app, you would compare a hashed password.
    // This is NOT secure for production.
    if (password !== 'password123') {
      return { success: false, message: 'Invalid email or password.' };
    }

    const schoolDoc = querySnapshot.docs[0];
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
