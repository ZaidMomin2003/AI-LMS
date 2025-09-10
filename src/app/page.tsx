
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { UseCases } from '@/components/landing/UseCases';
import { FAQ } from '@/components/landing/FAQ';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';
import { CTA } from '@/components/landing/CTA';
import { Workflow } from '@/components/landing/Workflow';
import { Testimonials } from '@/components/landing/Testimonials';
import { ValueComparison } from '@/components/landing/ValueComparison';
import { useProfile } from '@/context/ProfileContext';

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    // If the user is logged in and has completed their profile, redirect them to the dashboard.
    // Otherwise, they might need to go to onboarding.
    if (!authLoading && !profileLoading && user && profile) {
      router.replace('/dashboard');
    }
  }, [user, profile, authLoading, profileLoading, router]);

  // While loading, show a loader.
  if (authLoading || profileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not loading and no user (or user without profile), show the landing page.
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Workflow />
        <Testimonials />
        <Features />
        <ValueComparison />
        <UseCases />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
