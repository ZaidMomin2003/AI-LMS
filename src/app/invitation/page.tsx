
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, MessageCircle } from 'lucide-react';
import { Features } from '@/components/landing/Features';
import Link from 'next/link';

export default function InvitationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 w-fit rounded-full bg-primary/10 p-4 text-primary">
              <Gift className="h-10 w-10" />
            </div>
            <h1 className="font-headline text-4xl font-bold text-foreground sm:text-6xl">
              Shape the Future of Learning
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              We're inviting a select group of students to get <strong>3 months of Wisdom Pro, absolutely free</strong>. Help us build the best study tool ever, and get unlimited access in return. All we ask for is your honest feedback.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Accept Invitation <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
               <Button asChild variant="outline" size="lg">
                <a href="https://wa.link/9utpte" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with Us
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* --- Features Bento Grid --- */}
        <Features />

        {/* --- Final CTA --- */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              Ready to Join?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Your feedback is invaluable. Become a founding member of our student community and get unlimited access to every feature we have to offer.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Your Free Access <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
