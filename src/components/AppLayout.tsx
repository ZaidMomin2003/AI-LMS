
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { DndContext } from '@dnd-kit/core';

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
  Loader2,
  BarChart,
  ClipboardCheck,
  CalendarPlus,
  PanelLeft,
  User,
  Map,
  Gem,
  Timer,
  Camera,
  Folder,
  Sparkles,
  Bookmark,
  LifeBuoy,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useExam } from '@/context/ExamContext';
import { ExamCountdown } from './exam/ExamCountdown';
import { ThemeToggle } from './ThemeToggle';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import SageMakerChat from './sagemaker/SageMakerChat';
import { Button } from './ui/button';

function AppLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();
  const { exam } = useExam();
  const [isSageMakerOpen, setIsSageMakerOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const appIsLoading = authLoading || !user;

  if (appIsLoading) {
    return <AppLoadingScreen />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  }
  
  return (
     <Dialog open={isSageMakerOpen} onOpenChange={setIsSageMakerOpen}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <BookOpenCheck className="w-8 h-8 text-primary" />
              <span className="font-headline text-2xl font-bold">Wisdomis Fun</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard'}
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/subjects')}
                  tooltip={{ children: 'Subjects' }}
                >
                  <Link href="/dashboard/subjects">
                    <Folder />
                    <span>Subjects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/bookmarks')}
                  tooltip={{ children: 'Bookmarks' }}
                >
                  <Link href="/dashboard/bookmarks">
                    <Bookmark />
                    <span>Bookmarks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/plan')}
                  tooltip={{ children: 'Study Plan' }}
                >
                  <Link href="/dashboard/plan">
                    <ClipboardCheck />
                    <span>Study Plan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/roadmap')}
                >
                  <Link href="/dashboard/roadmap">
                    <Map />
                    <span>Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/pomodoro')}
                >
                  <Link href="/dashboard/pomodoro">
                    <Timer />
                    <span>Pomodoro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/capture')}
                >
                  <Link href="/dashboard/capture">
                    <Camera />
                    <span>Capture</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/analytics')}
                  tooltip={{ children: 'Analytics' }}
                >
                  <Link href="/dashboard/analytics">
                    <BarChart />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <DialogTrigger asChild>
                      <SidebarMenuButton tooltip={{ children: 'SageMaker AI' }}>
                          <Sparkles />
                          <span>SageMaker</span>
                      </SidebarMenuButton>
                  </DialogTrigger>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {exam ? (
              <ExamCountdown />
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/dashboard/exam')}
                    tooltip={{ children: 'Add Exam Countdown' }}
                    className="border-2 border-dashed border-primary/50 bg-transparent hover:bg-primary/10 hover:border-primary/80 shadow-lg shadow-primary/20 animate-pulse"
                  >
                    <Link href="/dashboard/exam">
                      <CalendarPlus />
                      <span>Add Exam</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        className="cursor-pointer border-0 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                        <div>
                            <Gem />
                            <span>Annual Pro</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center justify-between">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <SidebarMenuButton>
                          <Avatar className="h-9 w-9">
                              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{user.displayName || user.email?.split('@')[0]}</span>
                      </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="end" className="w-56 mb-2">
                      <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')} className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => router.push('/dashboard/support')} className="cursor-pointer">
                          <LifeBuoy className="mr-2 h-4 w-4" />
                          <span>Support</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 min-w-0 md:hidden">
                <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-6 h-6 text-primary" />
                    <span className="font-headline text-lg font-bold leading-tight">Wisdom<br className="sm:hidden" />is Fun</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/dashboard/bookmarks">
                      <Bookmark className="h-5 w-5" />
                      <span className="sr-only">Bookmarks</span>
                    </Link>
                  </Button>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Sparkles className="h-5 w-5" />
                      <span className="sr-only">Open SageMaker</span>
                    </Button>
                  </DialogTrigger>
                  <SidebarTrigger>
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                  </SidebarTrigger>
                </div>
            </header>
            <DndContext onDragEnd={() => {}}>
              <div className="flex-1 flex flex-col min-w-0">
                  <Suspense>{children}</Suspense>
              </div>
            </DndContext>
        </SidebarInset>
        <DialogContent className="w-[90vw] max-w-3xl h-[85vh] p-0">
          <SageMakerChat />
        </DialogContent>
      </SidebarProvider>
    </Dialog>
  );
}
