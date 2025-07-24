
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BookOpenCheck,
  LayoutDashboard,
  LogOut,
  BarChart,
  Users,
  PanelLeft,
  ShieldCheck,
  Mail,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // On a real app, this would be protected by auth state
  // For now, we assume if you're in the layout, you're logged in.
  
  const handleLogout = () => {
    router.push('/zaidadmin/login');
  };

  // We don't want to show the layout on the login page itself
  if (pathname === '/zaidadmin/login') {
      return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-headline text-2xl font-bold">Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/zaidadmin'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/zaidadmin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/zaidadmin/users')}
                tooltip={{ children: 'Users' }}
              >
                <Link href="/zaidadmin/users">
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/zaidadmin/analytics')}
                tooltip={{ children: 'Analytics' }}
              >
                <Link href="/zaidadmin/analytics">
                  <BarChart />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/zaidadmin/submissions')}
                tooltip={{ children: 'Submissions' }}
              >
                <Link href="/zaidadmin/submissions">
                  <Mail />
                  <span>Submissions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/zaidadmin/cost')}
                tooltip={{ children: 'Cost Analysis' }}
              >
                <Link href="/zaidadmin/cost">
                  <DollarSign />
                  <span>Cost Analysis</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Log Out'}}>
                        <LogOut />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 min-w-0 md:hidden">
              <div className="flex items-center gap-2">
                  <BookOpenCheck className="w-6 h-6 text-primary" />
                  <span className="font-headline text-lg font-bold">Admin</span>
              </div>
              <SidebarTrigger>
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
              </SidebarTrigger>
          </header>
          <div className="flex-1 flex flex-col min-w-0 bg-muted/40">
            {children}
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
