
import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin, isFirebaseAdminInitialized } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  if (!isFirebaseAdminInitialized()) {
      console.error("Firebase Admin not initialized. Cannot create session cookie.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const idToken = await request.text();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await firebaseAdmin.auth().createSessionCookie(idToken, { expiresIn });
    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set(options);
    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
