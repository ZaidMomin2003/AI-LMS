
'use client';

import { SchoolSignUpForm } from '@/components/auth/SchoolSignUpForm';
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SchoolAdminSignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <BookOpenCheck className="h-8 w-8 text-primary" />
             <span className="text-2xl font-bold font-headline">Wisdomis Fun</span>
          </div>
          <CardTitle className="text-2xl font-headline">Create a School Account</CardTitle>
          <CardDescription>Get started by creating an administrator account for your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolSignUpForm />
           <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/school/login" className="underline font-semibold text-primary">
                    Login
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
