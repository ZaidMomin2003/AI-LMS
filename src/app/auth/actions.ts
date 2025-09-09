
'use server';

import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  type User
} from 'firebase/auth';

/**
 * Signs up a new user with email and password.
 * @param name The user's full name.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The created user object or null on failure.
 */
export async function signUpWithEmailPassword(
  name: string,
  email: string,
  password: string
): Promise<User | null> {
  if (!auth) {
    throw new Error("Firebase is not initialized.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Update the user's profile with their name
    await updateProfile(user, { displayName: name });
    return user;
  } catch (error: any) {
    // Provide more user-friendly error messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email address is already in use.');
      case 'auth/weak-password':
        throw new Error('The password is too weak. Please use a stronger password.');
      default:
        throw new Error(error.message || 'An unexpected error occurred during sign-up.');
    }
  }
}

/**
 * Signs in a user with email and password.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The signed-in user object or null on failure.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<User | null> {
  if (!auth) {
    throw new Error("Firebase is not initialized.");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password. Please try again.');
      default:
        throw new Error(error.message || 'An unexpected error occurred during login.');
    }
  }
}
