
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, MessageCircle, UserPlus, Heart, Award } from 'lucide-react';
import { Features } from '@/components/landing/Features';
import Link from 'next/link';
import Image from 'next/image';

const freeWisdomSteps = [
  {
    title: 'Start Your Free Trial',
    description:
      'Chat with us and start your free trial',
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

                        <p className="mt-8 text-base text-muted-foreground sm:text-xl">We're inviting a select group of students to get <strong>1 month of Wisdom Pro, absolutely free</strong>. Help us build the best study tool ever, and get unlimited access in return. All we ask for is your honest feedback.</p>

                        <div className="mt-10">
                            <Button asChild size="lg">
                                <a href="https://wa.link/o0dcmr" title="" className="inline-flex items-center">
                                    <MessageCircle className="w-6 h-6 mr-3" />
                                    Chat with Us
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Image className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png" alt="Students collaborating" width={500} height={500} />
                    </div>
                </div>
            </div>
        </section>
        
        {/* --- How it Works Section --- */}
        <section className="py-20 sm:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        How to Get Your Free Month
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        It's a simple, three-step process. Your feedback helps us grow, and we want to thank you for it.
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
                        <a href="https://wa.link/o0dcmr" title="" className="inline-flex items-center">
                            <MessageCircle className="w-6 h-6 mr-3" />
                            Chat with Us to Get Started
                        </a>
                    </Button>
                </div>
            </div>
        </section>

        {/* --- Features Bento Grid --- */}
        <Features />

        {/* --- Final CTA --- */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-secondary/50">
              <div className="grid grid-cols-1 lg:grid-cols-10">
                <div className="lg:col-span-7 p-8 sm:p-16 flex flex-col justify-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                            Ready to Join?
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                            Your feedback is invaluable. Become a founding member of our student community and get unlimited access to every feature we have to offer. Don't miss out on this exclusive opportunity to shape the future of learning.
                        </p>
                        <div className="mt-8">
                             <Button asChild size="lg">
                                <a href="https://wa.link/o0dcmr" title="" className="inline-flex items-center">
                                    <MessageCircle className="w-6 h-6 mr-3" />
                                    Chat with Us
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-3 relative h-64 lg:h-full">
                    <Image
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                      alt="Student community"
                      layout="fill"
                      objectFit="cover"
                      className="h-full w-full"
                      data-ai-hint="student community"
                    />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
