
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpenCheck, LogOut, School as SchoolIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { schoolLogoutAction } from './actions';


export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await schoolLogoutAction();
    router.push('/school/login');
  };

  // Don't show the layout on the login page itself
  if (pathname === '/school/login') {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Link href="/school/dashboard" className="flex items-center gap-2 text-lg font-semibold font-headline text-foreground">
                <SchoolIcon className="h-6 w-6 text-primary" />
                <span className="font-bold">School Portal</span>
            </Link>
            <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
            </Button>
        </header>
        <main className="flex-1">
            {children}
        </main>
    </div>
  );
}
