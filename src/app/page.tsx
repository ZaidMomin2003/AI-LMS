
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

const freeWisdomSteps = [
  {
    title: 'Start Your Free Trial',
    description:
      'Sign up in seconds and generate your first full set of study materials on any topic. No credit card required.',
    icon: <UserPlus className="h-8 w-8" />,
  },
  {
    title: 'Share Your Experience',
    description:
      'Record a short, honest video or audio testimonial about how our AI helped you study smarter.',
    icon: <Heart className="h-8 w-8" />,
  },
  {
    title: 'Get 1 Month Free',
    description:
      'As a thank you, we\'ll upgrade your account to Wisdom Pro for a full month, unlocking unlimited access.',
    icon: <Award className="h-8 w-8" />,
  },
];


function FreeWisdomSection() {
  return (
    <section className="py-20 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Get Wisdom Pro for Free
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                We believe in the power of our platform. Get one month of unlimited access by sharing your story with us.
            </p>
        </div>

        <div className="relative mt-16">
            {/* Dashed line connecting the steps */}
            <div className="absolute top-1/2 left-0 hidden w-full -translate-y-1/2 md:block">
                <div className="w-full border-t-2 border-dashed border-border"></div>
            </div>

            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
                {freeWisdomSteps.map((step, index) => (
                <div key={index} className="relative text-center">
                    <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow-lg">
                        {step.icon}
                        <span className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full border bg-card text-lg font-bold text-foreground">{index + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold font-headline">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
                ))}
            </div>
        </div>
        <div className="mt-16 text-center">
            <Button asChild size="lg">
                <Link href="/invitation">Learn More & Get Started</Link>
            </Button>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <WelcomePopup />
        <Hero />
        <Workflow />
        <Testimonials />
        <FreeWisdomSection />
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
