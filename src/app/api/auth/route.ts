
import { NextResponse } from 'next/server';

// This endpoint is now disabled as Firebase Admin SDK has been removed.
export async function POST() {
  return NextResponse.json({ error: 'Server authentication is currently disabled.' }, { status: 503 });
}
