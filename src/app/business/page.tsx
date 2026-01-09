
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, FileText, Heart, MessageCircle, UserPlus, Zap } from 'lucide-react';
import { Features } from '@/components/landing/Features';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { VolumeCalculator } from '@/components/pricing/VolumeCalculator';
import { CalEmbed } from '@/components/business/CalEmbed';
import Link from 'next/link';

const faqs = [
  {
    question: 'How does the referral program work?',
    answer:
      'It\'s simple! Sign up for our partner program, and we will provide you with a unique referral link. Share this link on your blog, social media, or with your audience. You will earn a $39 commission for every new customer who signs up for a paid plan through your link.',
  },
  {
    question: 'How is my commission tracked?',
    answer:
      'We use a sophisticated tracking system. When a user clicks your unique referral link, a cookie is placed in their browser for 30 days. If they purchase any paid plan within that period, the sale is automatically attributed to you.',
  },
  {
    question: 'When and how do I get paid?',
    answer:
      'We process payouts monthly via PayPal. You will need a valid PayPal account to receive your commissions. Payments are made on the 15th of each month for the commissions earned in the previous month.',
  },
  {
    question: 'Is there a limit to how much I can earn?',
    answer:
      'Absolutely not! There is no cap on the amount of commission you can earn. The more customers you refer, the more you make. We succeed when you succeed.',
  },
];

export default function BusinessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-transparent to-background" />
          <div className="container mx-auto px-4">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <p className="text-base font-semibold uppercase tracking-wider text-primary">
                Become a Wisdom Partner
              </p>
              <h1 className="font-headline mt-4 text-4xl font-bold text-foreground sm:text-6xl xl:text-7xl">
                Connect & Grow With Us
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:text-xl">
                Share the future of learning and earn commissions for every student you bring to Wisdom.
              </p>
              <Button asChild size="lg" className="mt-10">
                <a href="https://forms.gle/4rANNRPbBCv15DFFA" target="_blank" rel="noopener noreferrer">
                  Become a Partner <ArrowRight className="ml-2" />
                </a>
              </Button>
            </div>
            
            {/* Floating Metric Cards */}
            <div className="absolute top-1/4 left-10 hidden h-28 w-48 animate-float rounded-2xl border bg-card/50 p-4 shadow-lg backdrop-blur-sm [animation-delay:-1s] lg:block">
              <p className="text-sm font-semibold text-foreground">Commission</p>
              <p className="text-3xl font-bold text-primary">$39</p>
              <p className="text-xs text-muted-foreground">per sale</p>
            </div>
             <div className="absolute bottom-1/4 right-10 hidden h-28 w-48 animate-float rounded-2xl border bg-card/50 p-4 shadow-lg backdrop-blur-sm [animation-delay:-2.5s] lg:block">
              <p className="text-sm font-semibold text-foreground">Cookie Duration</p>
              <p className="text-3xl font-bold text-primary">30</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
             <div className="absolute bottom-1/2 left-20 hidden h-20 w-36 animate-float rounded-2xl border bg-card/50 p-3 shadow-lg backdrop-blur-sm [animation-delay:-2s] lg:block">
              <p className="text-xs font-semibold text-foreground">Payouts</p>
              <p className="text-2xl font-bold text-primary">Monthly</p>
            </div>
            
            {/* SVG Icons */}
            <div className="absolute top-20 right-20 hidden h-16 w-16 animate-float text-primary/70 [animation-delay:-0.5s] lg:block">
              <UserPlus />
            </div>
             <div className="absolute bottom-20 left-1/4 hidden h-12 w-12 animate-float text-primary/50 [animation-delay:-3s] lg:block">
              <Heart />
            </div>
          </div>
        </section>

        {/* --- Collaboration Section --- */}
        <section id="schedule-call" className="bg-secondary/50 py-20 sm:py-24">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                    Schedule a Partnership Call
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    Interested in a deeper collaboration? Book a 15-minute introductory call with our founder.
                </p>
              </div>
              <CalEmbed />
          </div>
        </section>
        
        {/* --- Volume Discount Calculator --- */}
        <VolumeCalculator />

        <Features />

        {/* --- FAQ Section --- */}
        <section className="bg-secondary/50 py-20 sm:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              Partnership FAQs
            </h2>
            <Accordion type="single" collapsible className="mt-12 w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border bg-background shadow-sm"
                >
                  <AccordionTrigger className="p-6 text-left hover:no-underline">
                    <span className="flex-1 font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[40px] bg-primary p-6 sm:p-10 md:p-20">
              <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
                  <div className="absolute top-1/2 right-[-45%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
                      <div className="absolute inset-0 rounded-full bg-primary/80 opacity-30"></div>
                      <div className="absolute inset-0 scale-[0.8] rounded-full bg-primary/70 opacity-30"></div>
                      <div className="absolute inset-0 scale-[0.6] rounded-full bg-primary/50 opacity-30"></div>
                      <div className="absolute inset-0 scale-[0.4] rounded-full bg-primary/30 opacity-30"></div>
                      <div className="absolute inset-0 scale-[0.2] rounded-full bg-primary/10 opacity-30"></div>
                      <div className="absolute inset-0 scale-[0.1] rounded-full bg-white/50 opacity-30"></div>
                  </div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">
                  Ready to Discuss a Partnership?
                </h2>
                <p className="mb-6 max-w-md text-base text-primary-foreground/90 sm:text-lg md:mb-8">
                  Let's connect. Schedule a 15-minute call to discuss how we can work together and grow.
                </p>
                <Button asChild size="lg" className="bg-card text-card-foreground hover:bg-card/90 shadow-lg">
                  <Link href="#schedule-call">
                    Schedule a Call <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
