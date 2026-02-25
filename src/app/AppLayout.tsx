

'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { initializeFirebase } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useSubscription } from '@/context/SubscriptionContext';

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
  FileQuestion,
  Workflow,
  ArrowRight,
  Loader2,
  Expand,
  Minimize,
  FileClock,
  ArrowLeft,
  Crown,
  PenSquare,
  AlertTriangle,
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
} from './ui/dropdown-menu';
import { useExam } from '@/context/ExamContext';
import { ExamCountdown } from '@/components/exam/ExamCountdown';
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
import { format } from 'date-fns';

function AppLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

function GracePeriodWarning() {
    const { subscription } = useSubscription();

    if (!subscription?.gracePeriodEnds) return null;

    const endDate = format(new Date(subscription.gracePeriodEnds), 'MMMM d, yyyy');

    return (
        <div className="bg-amber-500/10 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 p-4 rounded-md mb-4" role="alert">
            <div className="flex">
                <div className="py-1">
                    <AlertTriangle className="h-5 w-5 mr-3" />
                </div>
                <div>
                    <p className="font-bold">Subscription Expired</p>
                    <p className="text-sm">
                        Your Pro access will end on {endDate}. Please <Link href="/dashboard/pricing" className="underline font-semibold">renew your subscription</Link> to continue using all features without interruption.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SidebarSubscriptionButton() {
    const { subscription } = useSubscription();

    const isLifetime = subscription?.plan === 'Lifetime Sage';

    const planName = isLifetime ? 'Lifetime Sage' : (subscription?.status === 'active' ? 'Pro Plan' : 'Upgrade to Pro');
    const planDescription = isLifetime ? 'Full access, forever.' : (subscription?.status === 'active' ? 'Unlimited access' : 'Unlock all features');

    const buttonClasses = cn(
        "group relative rounded-lg p-4 overflow-hidden text-primary-foreground",
        isLifetime 
            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black" 
            : "bg-gradient-to-br from-primary/80 to-primary"
    );
    
    const iconContainerClasses = cn(
        "absolute top-1 right-1 rounded-full p-1.5",
        isLifetime 
            ? "bg-black/10 text-black"
            : "bg-primary-foreground/20 text-primary-foreground"
    );

    return (
        <Link href="/dashboard/pricing" className="block p-2">
            <div className={buttonClasses}>
                <h4 className="font-bold text-base font-headline flex items-center gap-2">
                    {isLifetime ? <Crown className="w-5 h-5" /> : <Gem className="w-5 h-5" />}
                    {planName}
                </h4>
                <p className={cn("text-xs", isLifetime ? "text-black/70" : "text-primary-foreground/80")}>
                     {planDescription}
                </p>
                 <div className={iconContainerClasses}>
                    {subscription?.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                </div>
                <Sparkles className={cn(
                    "absolute -bottom-4 -right-2 w-16 h-16",
                    isLifetime ? "text-black/10" : "text-primary-foreground/10"
                )} />
            </div>
        </Link>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading, canUseFeature, isInGracePeriod } = useSubscription();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { exam } = useExam();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  const appIsLoading = authLoading || subLoading || !user;

  if (appIsLoading) {
    return <AppLoadingScreen />;
  }
  
  const canUseWisdomGpt = canUseFeature('wisdomGpt');
  
  // The special case for wisdomgpt has been moved to its own page component
  // for better separation of concerns.

  const handleLogout = async () => {
    const { auth } = initializeFirebase();
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                  <span className="font-bold font-headline text-xl -mb-1">Wisdom</span>
                  <span className="text-xs text-muted-foreground">AI Studybuddy</span>
              </div>
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

                <SidebarSeparator />

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
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/roadmap')}>
                            <Link href="/dashboard/roadmap">
                                <Map /><span>Roadmap</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/quiz')}>
                            <Link href="/dashboard/quiz">
                                <FileQuestion />
                                <span className="flex items-center gap-2">
                                    AI Quiz <Badge variant="secondary" className="text-xs">Soon</Badge>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/pomodoro')}>
                            <Link href="/dashboard/pomodoro">
                                <Timer /><span>Pomodoro</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/capture')}>
                            <Link href="/dashboard/capture">
                                <Camera />
                                <span className="flex items-center gap-2">Capture <Badge variant="secondary" className="text-xs">Beta</Badge></span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/wisdomgpt')} tooltip={{ children: canUseWisdomGpt ? 'WisdomGPT AI' : 'Upgrade to Pro' }}>
                            <Link href={canUseWisdomGpt ? '/dashboard/wisdomgpt' : '/dashboard/pricing'}>
                                <Sparkles />
                                <span>WisdomGPT</span>
                                {!canUseWisdomGpt && <Lock className="ml-auto w-4 h-4 text-muted-foreground" />}
                            </Link>
                        </SidebarMenuButton>
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
                    className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-foreground border border-primary/20"
                  >
                    <Link href="/dashboard/exam">
                      <CalendarPlus />
                      <span>Add Exam Countdown</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
             <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <SidebarSubscriptionButton />
             </Suspense>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2 h-auto text-left bg-muted/50 data-[state=open]:bg-muted">
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
                    <DropdownMenuItem onSelect={() => router.push('/dashboard/personalization')} className="cursor-pointer">
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span>Personalization</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push('/dashboard/support')} className="cursor-pointer">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => router.push('/roadmap')} className="cursor-pointer">
                        <FileClock className="mr-2 h-4 w-4" />
                        <span>Changelog</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={toggleFullscreen} className="cursor-pointer">
                        {isFullscreen ? <Minimize className="mr-2 h-4 w-4" /> : <Expand className="mr-2 h-4 w-4" />}
                        <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-default focus:bg-transparent">
                        <div className="flex items-center justify-between w-full">
                           <span>Theme</span>
                           <ThemeToggle />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 min-w-0 md:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md">
                        <BookOpenCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold font-headline text-lg -mb-1">Wisdom</span>
                      <span className="text-xs text-muted-foreground">AI Studybuddy</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/dashboard/bookmarks">
                      <Bookmark className="h-5 w-5" />
                      <span className="sr-only">Bookmarks</span>
                    </Link>
                  </Button>
                    <Button asChild variant="ghost" size="icon">
                      <Link href="/dashboard/wisdomgpt">
                        <Sparkles className="h-5 w-5" />
                        <span className="sr-only">Open WisdomGPT</span>
                      </Link>
                    </Button>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                    <span className="sr-only">Toggle Fullscreen</span>
                  </Button>
                  <SidebarTrigger>
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                  </SidebarTrigger>
                </div>
            </header>
            <DndContext onDragEnd={() => {}}>
              <div className="flex-1 flex flex-col min-w-0 p-4">
                  {isInGracePeriod && <GracePeriodWarning />}
                  <Suspense>{children}</Suspense>
              </div>
            </DndContext>
        </SidebarInset>
      </SidebarProvider>
  );
}

  

    
