
'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

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
import { useSubscription } from '@/context/SubscriptionContext';
import type { SubscriptionPlan } from '@/types';
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { usePomodoro } from '@/context/PomodoroContext';
import { useTopic } from '@/context/TopicContext';
import { useRoadmap } from '@/context/RoadmapContext';
import { useProfile } from '@/context/ProfileContext';
import { Badge } from './ui/badge';

function AppLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

function SidebarSubscriptionButton() {
    const { subscription, setSubscription } = useSubscription();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkoutStatus = searchParams.get('checkout');
        const sessionId = searchParams.get('session_id');

        if (checkoutStatus === 'success' && sessionId) {
            try {
                const planName = sessionStorage.getItem('pending_subscription_plan') as SubscriptionPlan | null;
                if (planName) {
                    setSubscription({
                        planName: planName,
                        status: 'active',
                        stripeSessionId: sessionId,
                    });
                    sessionStorage.removeItem('pending_subscription_plan');
                    window.history.replaceState(null, '', '/dashboard');
                }
            } catch (error) {
                console.error("Error processing subscription update from URL", error);
            }
        }
    }, [searchParams, setSubscription, pathname]);


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
            tooltip={{ children: 'Your Current Plan' }}
            className="cursor-default border-0 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
            <Link href="/dashboard">
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
  const isSageMakerLocked = isHobby;
  const isRoadmapLocked = isHobby && !!roadmap;
  const isPomodoroLocked = isHobby && pomodoroHistory.length > 0;
  const isCaptureLocked = isHobby && (profile?.captureCount ?? 0) >= 1;


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <BookOpenCheck className="w-8 h-8 text-primary" />
            <span className="font-headline text-2xl font-bold">ScholarAI</span>
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
               <Tooltip>
                 <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/sagemaker')}
                    >
                      <Link href="/dashboard/sagemaker" className={cn(isSageMakerLocked && 'text-muted-foreground')}>
                        <Bot />
                        <span>SageMaker</span>
                        {isSageMakerLocked && <Lock className="ml-auto h-3 w-3" />}
                      </Link>
                    </SidebarMenuButton>
                 </TooltipTrigger>
                 {isSageMakerLocked && (
                    <TooltipContent side="right" align="center">
                        <p>Upgrade to unlock SageMaker</p>
                    </TooltipContent>
                 )}
               </Tooltip>
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
              <Tooltip>
                 <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/roadmap')}
                    >
                      <Link href="/dashboard/roadmap" className={cn(isRoadmapLocked && 'text-muted-foreground')}>
                        <Map />
                        <span>Roadmap</span>
                        {isRoadmapLocked && <Lock className="ml-auto h-3 w-3" />}
                      </Link>
                    </SidebarMenuButton>
                 </TooltipTrigger>
                 {isRoadmapLocked && (
                    <TooltipContent side="right" align="center">
                        <p>Upgrade for unlimited roadmaps</p>
                    </TooltipContent>
                 )}
               </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                 <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/pomodoro')}
                    >
                      <Link href="/dashboard/pomodoro" className={cn(isPomodoroLocked && 'text-muted-foreground')}>
                        <Timer />
                        <span>Pomodoro</span>
                        {isPomodoroLocked && <Lock className="ml-auto h-3 w-3" />}
                      </Link>
                    </SidebarMenuButton>
                 </TooltipTrigger>
                 {isPomodoroLocked && (
                    <TooltipContent side="right" align="center">
                        <p>Upgrade for unlimited sessions</p>
                    </TooltipContent>
                 )}
               </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Tooltip>
                 <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/capture')}
                    >
                      <Link href="/dashboard/capture" className={cn(isCaptureLocked && 'text-muted-foreground')}>
                        <Camera />
                        <span className="flex items-center gap-2">
                          Capture <Badge variant="secondary" className="text-xs">Beta</Badge>
                        </span>
                        {isCaptureLocked && <Lock className="ml-auto h-3 w-3" />}
                      </Link>
                    </SidebarMenuButton>
                 </TooltipTrigger>
                 {isCaptureLocked && (
                    <TooltipContent side="right" align="center">
                        <p>Upgrade for unlimited captures</p>
                    </TooltipContent>
                 )}
               </Tooltip>
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
                  <span className="font-headline text-lg font-bold">ScholarAI</span>
              </div>
              <SidebarTrigger>
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
              </SidebarTrigger>
          </header>
          <div className="flex-1 flex flex-col min-w-0">
            <Suspense>{children}</Suspense>
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
