
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function schoolLogoutAction() {
  cookies().delete('school-session');
  redirect('/school/login');
}
