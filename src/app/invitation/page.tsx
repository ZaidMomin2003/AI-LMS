
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, MessageCircle } from 'lucide-react';
import { Features } from '@/components/landing/Features';
import Link from 'next/link';
import Image from 'next/image';

export default function InvitationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="bg-secondary/20 py-28 sm:py-16 lg:py-32">
            <div className="container mx-auto max-w-7xl">
                <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground sm:text-6xl lg:text-7xl font-headline">
                            Shape the Future of 
                            <div className="relative inline-flex">
                                <span className="absolute inset-x-0 bottom-0 border-b-[20px] border-primary/30"></span>
                                <h1 className="relative text-4xl font-bold text-foreground sm:text-6xl lg:text-7xl font-headline">Learning.</h1>
                            </div>
                        </h1>

                        <p className="mt-8 text-base text-muted-foreground sm:text-xl">We're inviting a select group of students to get <strong>3 months of Wisdom Pro, absolutely free</strong>. Help us build the best study tool ever, and get unlimited access in return. All we ask for is your honest feedback.</p>

                        <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                            <Button asChild size="lg">
                                <Link href="/signup">
                                    Accept Invitation <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <a href="https://wa.link/9utpte" title="" className="inline-flex items-center mt-6 text-base font-semibold transition-all duration-200 sm:mt-0 hover:opacity-80">
                                <MessageCircle className="w-8 h-8 mr-3 text-primary" />
                                Chat with Us
                            </a>
                        </div>
                    </div>

                    <div>
                        <Image className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png" alt="Students collaborating" width={500} height={500} />
                    </div>
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
