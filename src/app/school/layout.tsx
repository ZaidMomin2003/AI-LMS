
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, School as SchoolIcon, LayoutDashboard, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schoolLogoutAction } from './actions';
import { cn } from '@/lib/utils';


export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await schoolLogoutAction();
    router.push('/school/login');
  };

  const navItems = [
    { href: '/school/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/school/dashboard/licenses', label: 'Licenses', icon: Receipt },
  ];

  // Don't show the layout on the login page itself
  if (pathname === '/school/login') {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full flex">
        <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/school/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                    <SchoolIcon className="h-6 w-6 text-primary" />
                    <span>School Portal</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
                {navItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === item.href && "bg-muted text-primary"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
        <div className="flex flex-col flex-1">
             <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:justify-end sm:px-6">
                <Link href="/school/dashboard" className="flex items-center gap-2 text-lg font-semibold font-headline text-foreground sm:hidden">
                    <SchoolIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold">School Portal</span>
                </Link>
                <Button onClick={handleLogout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </Button>
            </header>
            <main className="flex-1 bg-muted/40">
                {children}
            </main>
        </div>
    </div>
  );
}
