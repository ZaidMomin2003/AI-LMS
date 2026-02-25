

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

function AppLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

function SidebarSubscriptionButton() {
  const { subscription } = useSubscription();

  const isLifetime = subscription?.plan === 'Lifetime Sage';
  const planName = isLifetime ? 'Lifetime Sage' : (subscription?.status === 'active' ? 'Pro Plan' : 'Upgrade to Pro');
  const planDescription = isLifetime ? 'Full access, forever.' : (subscription?.status === 'active' ? 'Unlimited access' : 'Unlock all features');

  return (
    <Link href="/dashboard/pricing" className="block px-2">
      <div className={cn(
        "group relative rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border shadow-2xl",
        isLifetime
          ? "bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/30 shadow-amber-500/10"
          : "bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/20 shadow-primary/10"
      )}>
        {/* Background Ambient Glow */}
        <div className={cn(
          "absolute -top-10 -right-10 w-24 h-24 blur-[40px] rounded-full opacity-50",
          isLifetime ? "bg-yellow-400" : "bg-primary"
        )} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl border shadow-inner",
              isLifetime
                ? "bg-amber-500/20 border-amber-500/30 text-amber-500"
                : "bg-primary/20 border-primary/30 text-primary"
            )}>
              {isLifetime ? <Crown className="w-4 h-4" /> : <Gem className="w-4 h-4" />}
            </div>
            {subscription?.status === 'active' && (
              <Badge variant="outline" className={cn(
                "h-5 px-1.5 text-[8px] font-black uppercase tracking-widest border-0",
                isLifetime ? "bg-amber-500/20 text-amber-600" : "bg-primary/20 text-primary"
              )}>
                Active
              </Badge>
            )}
          </div>

          <h4 className={cn(
            "font-black text-sm tracking-tighter uppercase mb-0.5",
            isLifetime ? "text-amber-600" : "text-primary"
          )}>
            {planName}
          </h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none opacity-60">
            {planDescription}
          </p>
        </div>

        {/* Decorative Element */}
        <Sparkles className={cn(
          "absolute -bottom-2 -left-2 w-12 h-12 opacity-10 rotate-12",
          isLifetime ? "text-amber-500" : "text-primary"
        )} />

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowRight className={cn(
            "w-4 h-4",
            isLifetime ? "text-amber-500" : "text-primary"
          )} />
        </div>
      </div>
    </Link>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading, canUseFeature } = useSubscription();
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
      <Sidebar className="border-r border-border/10 bg-background/60 backdrop-blur-2xl">
        <SidebarHeader className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-blue-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group/logo">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
              <BookOpenCheck className="h-6 w-6 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-2xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent leading-none">WISDOM</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 mt-0.5">Neural OS</span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="relative px-3">
          {/* Neural Background Pattern */}
          <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />
          <div className="absolute top-1/4 left-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />

          <SidebarMenu className="relative z-10 space-y-1">
            {/* --- Main Dashboard --- */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">Overview</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard'}
                  className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/analytics')}
                  className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  tooltip={{ children: 'Analytics' }}
                >
                  <Link href="/dashboard/analytics">
                    <BarChart className="w-5 h-5" />
                    <span className="font-medium">Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarSeparator className="mx-2 opacity-50" />

            {/* --- Organize Section --- */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">Organize</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/subjects')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary" tooltip={{ children: 'Subjects' }}>
                  <Link href="/dashboard/subjects"><Folder className="w-5 h-5" /><span>Subjects</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/bookmarks')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary" tooltip={{ children: 'Bookmarks' }}>
                  <Link href="/dashboard/bookmarks"><Bookmark className="w-5 h-5" /><span>Bookmarks</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/plan')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary" tooltip={{ children: 'Study Plan' }}>
                  <Link href="/dashboard/plan"><ClipboardCheck className="w-5 h-5" /><span>Study Plan</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarSeparator className="mx-2 opacity-50" />

            {/* --- Tools Section --- */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">Tools & AI</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/roadmap')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                  <Link href="/dashboard/roadmap">
                    <Map className="w-5 h-5" /><span>Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/quiz')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                  <Link href="/dashboard/quiz">
                    <FileQuestion className="w-5 h-5" />
                    <span className="flex items-center gap-2">
                      AI Quiz <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-tighter">Soon</Badge>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/pomodoro')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                  <Link href="/dashboard/pomodoro">
                    <Timer className="w-5 h-5" /><span>Pomodoro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/capture')} className="h-10 transition-all hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                  <Link href="/dashboard/capture">
                    <Camera className="w-5 h-5" />
                    <span className="flex items-center gap-2">Capture <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-tighter">Beta</Badge></span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/wisdomgpt')}
                  className={cn(
                    "h-11 rounded-lg transition-all",
                    canUseWisdomGpt
                      ? "bg-gradient-to-r from-primary/5 to-purple-500/5 hover:from-primary/10 hover:to-purple-500/10 text-foreground"
                      : "text-muted-foreground/60 opacity-70"
                  )}
                  tooltip={{ children: canUseWisdomGpt ? 'WisdomGPT AI' : 'Upgrade to Pro' }}
                >
                  <Link href={canUseWisdomGpt ? '/dashboard/wisdomgpt' : '/dashboard/pricing'}>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-primary to-purple-600 text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-primary">WisdomGPT</span>
                    {!canUseWisdomGpt && <Lock className="ml-auto w-3 h-3 text-muted-foreground" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 space-y-4">
          {exam ? (
            <ExamCountdown />
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/exam')}
                  tooltip={{ children: 'Add Exam Countdown' }}
                  className="h-11 bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 rounded-xl"
                >
                  <Link href="/dashboard/exam" className="flex items-center justify-center">
                    <CalendarPlus className="w-5 h-5 mr-1" />
                    <span className="font-semibold text-xs">Add Exam Goal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}

          <Suspense fallback={<Skeleton className="h-16 w-full rounded-xl" />}>
            <SidebarSubscriptionButton />
          </Suspense>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-14 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                  </div>
                  <div className="flex-1 text-left truncate leading-tight">
                    <p className="text-sm font-bold truncate">{user.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-muted-foreground font-medium truncate opacity-70">{user.email}</p>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground/50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-64 mb-2 p-2 rounded-xl border-border/50 shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="font-normal px-2 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user.displayName || 'User Account'}</p>
                  <p className="text-xs leading-none text-muted-foreground opacity-70">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              <div className="p-1 space-y-0.5">
                <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')} className="cursor-pointer rounded-lg px-2 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-500 mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/dashboard/personalization')} className="cursor-pointer rounded-lg px-2 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-500 mr-2">
                    <PenSquare className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Personalization</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/dashboard/support')} className="cursor-pointer rounded-lg px-2 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/10 text-orange-500 mr-2">
                    <LifeBuoy className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Help & Support</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="opacity-50" />
              <div className="p-1">
                <DropdownMenuItem onSelect={toggleFullscreen} className="cursor-pointer rounded-lg px-2 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground mr-2">
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                  </div>
                  <span className="font-medium text-sm">{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                </DropdownMenuItem>
                <div className="flex items-center justify-between px-2 py-2 mt-1">
                  <span className="text-xs font-bold text-muted-foreground/60 uppercase ml-1">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
              <DropdownMenuSeparator className="opacity-50" />
              <div className="p-1">
                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer rounded-lg px-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 mr-2">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-lg md:hidden">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg font-bold -mb-1">Wisdom</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">Studybuddy</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/dashboard/wisdomgpt">
                <Sparkles className="h-5 w-5 text-primary" />
              </Link>
            </Button>
            <SidebarTrigger className="rounded-full">
              <PanelLeft className="h-5 w-5" />
            </SidebarTrigger>
          </div>
        </header>
        <DndContext onDragEnd={() => { }}>
          <div className="flex-1 flex flex-col min-w-0 px-4 py-4 md:px-8 md:py-6">
            <Suspense fallback={
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </DndContext>
      </SidebarInset>
    </SidebarProvider>
  );
}




