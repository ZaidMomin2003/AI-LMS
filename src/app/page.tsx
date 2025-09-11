
'use client';

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

export default function LandingPage() {
  // The automatic redirect for logged-in users has been removed
  // to allow them to visit the homepage. Access to the dashboard
  // is available through the header button.

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Workflow />
        <ValueComparison />
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
