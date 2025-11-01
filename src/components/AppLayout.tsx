
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  BookOpenCheck,
  LayoutDashboard,
  LogOut,
  Loader2,
  Zap,
  BarChart,
  Bot,
  ClipboardCheck,
  CalendarPlus,
  PanelLeft,
  User,
  Map,
  Gem,
  Lock,
  Timer,
  Camera,
  Folder,
  MessageSquare,
  Sparkles,
  Bookmark,
  LifeBuoy,
  MoreHorizontal,
  Search,
  CheckCircle,
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
import { ExamCountdown } from '../exam/ExamCountdown';
import { useSubscription } from '@/context/SubscriptionContext';
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { usePomodoro } from '@/context/PomodoroContext';
import { useTopic } from '@/context/TopicContext';
import { useRoadmap } from '@/context/RoadmapContext';
import { useProfile } from '@/context/ProfileContext';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';

function AppLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

function SidebarSubscriptionButton() {
    const { subscription } = useSubscription();
    const pathname = usePathname();

    if (subscription?.planName === 'Hobby') {
        return (
            <SidebarMenuButton
                asChild
                isActive={pathname === '/pricing'}
                tooltip={{ children: 'Upgrade Now' }}
                className="border-2 border-dashed border-primary/50 bg-transparent hover:bg-primary/10 hover:border-primary/80 text-primary shadow-lg shadow-primary/20 animate-pulse"
            >
                <Link href="/pricing">
                    <Zap />
                    <span>Upgrade Now</span>
                </Link>
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuButton
            asChild
            isActive={pathname === '/pricing'}
            tooltip={{ children: 'Manage Your Plan' }}
            className="cursor-pointer border-0 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
            <Link href="/pricing">
                <Gem />
                <span>{subscription?.planName}</span>
            </Link>
        </SidebarMenuButton>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { pomodoroHistory, loading: pomodoroLoading } = usePomodoro();
  const { topics, dataLoading: topicsLoading } = useTopic();
  const { roadmap, loading: roadmapLoading } = useRoadmap();
  const { profile, loading: profileLoading } = useProfile();
  
  const router = useRouter();
  const pathname = usePathname();
  const { exam } = useExam();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const appIsLoading = authLoading || !user || subscriptionLoading || pomodoroLoading || topicsLoading || roadmapLoading || profileLoading;

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

  const isHobby = subscription?.planName === 'Hobby';
  const isRoadmapLocked = isHobby && !!roadmap;
  const isPomodoroLocked = isHobby && pomodoroHistory.length > 0;
  const isCaptureLocked = isHobby && (profile?.captureCount ?? 0) >= 1;
  
  const sageMakerAllowed = subscription?.planName && ['Hobby', 'Scholar Subscription', 'Sage Mode'].includes(subscription.planName);

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <BookOpenCheck className="w-8 h-8 text-primary" />
              <span className="font-headline text-2xl font-bold">Wisdomis Fun</span>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 h-9" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                {/* --- Main Dashboard --- */}
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
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/analytics')} tooltip={{ children: 'Analytics' }}>
                        <Link href="/dashboard/analytics"><BarChart /><span>Analytics</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {/* --- Organize Section --- */}
                <SidebarGroup>
                    <SidebarGroupLabel>Organize</SidebarGroupLabel>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/subjects')} tooltip={{ children: 'Subjects' }}>
                            <Link href="/dashboard/subjects"><Folder /><span>Subjects</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/bookmarks')} tooltip={{ children: 'Bookmarks' }}>
                            <Link href="/dashboard/bookmarks"><Bookmark /><span>Bookmarks</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/plan')} tooltip={{ children: 'Study Plan' }}>
                            <Link href="/dashboard/plan"><ClipboardCheck /><span>Study Plan</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroup>
                
                <SidebarSeparator />

                {/* --- Tools Section --- */}
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarMenuItem>
                        <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/roadmap')}>
                                    <Link href="/dashboard/roadmap" className={cn(isRoadmapLocked && 'text-muted-foreground')}>
                                        <Map /><span>Roadmap</span>
                                        {isRoadmapLocked && <Lock className="ml-auto h-3 w-3" />}
                                    </Link>
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            {isRoadmapLocked && <TooltipContent side="right" align="center"><p>Upgrade for unlimited roadmaps</p></TooltipContent>}
                        </Tooltip></TooltipProvider>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/pomodoro')}>
                                    <Link href="/dashboard/pomodoro" className={cn(isPomodoroLocked && 'text-muted-foreground')}>
                                        <Timer /><span>Pomodoro</span>
                                        {isPomodoroLocked && <Lock className="ml-auto h-3 w-3" />}
                                    </Link>
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            {isPomodoroLocked && <TooltipContent side="right" align="center"><p>Upgrade for unlimited sessions</p></TooltipContent>}
                        </Tooltip></TooltipProvider>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild>
                                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/capture')}>
                                    <Link href="/dashboard/capture" className={cn(isCaptureLocked && 'text-muted-foreground')}>
                                        <Camera />
                                        <span className="flex items-center gap-2">Capture <Badge variant="secondary" className="text-xs">Beta</Badge></span>
                                        {isCaptureLocked && <Lock className="ml-auto h-3 w-3" />}
                                    </Link>
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            {isCaptureLocked && <TooltipContent side="right" align="center"><p>Upgrade for unlimited captures</p></TooltipContent>}
                        </Tooltip></TooltipProvider>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <TooltipProvider><Tooltip>
                            <TooltipTrigger asChild disabled={!sageMakerAllowed}>
                                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/sagemaker')} tooltip={{ children: 'SageMaker AI' }} className={cn(!sageMakerAllowed && 'text-muted-foreground')}>
                                    <Link href="/dashboard/sagemaker">
                                        <Sparkles /><span>SageMaker</span>
                                        {!sageMakerAllowed && <Lock className="ml-auto h-3 w-3" />}
                                    </Link>
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            {!sageMakerAllowed && <TooltipContent side="right" align="center"><p>Upgrade to unlock SageMaker</p></TooltipContent>}
                        </Tooltip></TooltipProvider>
                    </SidebarMenuItem>
                </SidebarGroup>
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
                <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                  <SidebarSubscriptionButton />
                </Suspense>
              </SidebarMenuItem>
            </SidebarMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2 h-auto text-left">
                        <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 truncate">
                                <p className="text-sm font-medium truncate">{user.displayName || user.email?.split('@')[0]}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </Button>
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
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-default focus:bg-transparent">
                        <div className="flex items-center justify-between w-full">
                           <span>Theme</span>
                           <ThemeToggle />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 min-w-0 md:hidden">
                <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-6 h-6 text-primary" />
                    <span className="font-headline text-lg font-bold">Wisdomis Fun</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/dashboard/bookmarks">
                      <Bookmark className="h-5 w-5" />
                      <span className="sr-only">Bookmarks</span>
                    </Link>
                  </Button>
                  {sageMakerAllowed && (
                    <Button asChild variant="ghost" size="icon">
                      <Link href="/dashboard/sagemaker">
                        <Sparkles className="h-5 w-5" />
                        <span className="sr-only">Open SageMaker</span>
                      </Link>
                    </Button>
                  )}
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
      </SidebarProvider>
  );
}
