
import { auth } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  await initAdmin();

  const idToken = await request.text();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });
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
