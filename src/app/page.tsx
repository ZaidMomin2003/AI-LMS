
'use client';

import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { UseCases } from '@/components/landing/UseCases';
import { FAQ } from '@/components/landing/FAQ';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';
import { CTA } from '@/components/landing/CTA';
import { WelcomePopup } from '@/components/landing/WelcomePopup';
import { Workflow } from '@/components/landing/Workflow';
import { Testimonials } from '@/components/landing/Testimonials';
import { Award, Heart, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <WelcomePopup />
        <Hero />
        <Workflow />
        <Testimonials />
        <Features />
        <UseCases />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
