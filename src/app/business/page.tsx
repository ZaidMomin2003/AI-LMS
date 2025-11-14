
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, Gift, Check, Zap } from 'lucide-react';
import Link from 'next/link';
import { Features } from '@/components/landing/Features';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { VolumeCalculator } from '@/components/pricing/VolumeCalculator';

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
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="relative z-10 text-center lg:text-left">
                <p className="text-base font-semibold uppercase tracking-wider text-primary">
                  A Social media for learners
                </p>
                <h1 className="font-headline mt-6 text-4xl font-bold text-foreground sm:text-6xl xl:text-7xl">
                  Connect & learn from the experts
                </h1>
                <p className="mt-8 text-lg text-muted-foreground sm:text-xl">
                  Grow your career fast with the right mentor.
                </p>
                <Button asChild size="lg" className="mt-10">
                  <a href="https://forms.gle/4rANNRPbBCv15DFFA" target="_blank" rel="noopener noreferrer">
                    Become a Partner <ArrowRight className="ml-2" />
                  </a>
                </Button>
              </div>

              <div className="relative h-96 lg:h-[500px]">
                {/* Person 1 */}
                <div className="absolute top-0 left-1/4 z-10 h-32 w-32 animate-float rounded-full bg-yellow-400 p-2 shadow-lg lg:h-40 lg:w-40">
                  <Image
                    data-ai-hint={placeholderImages.businessHero.person1.hint}
                    src={placeholderImages.businessHero.person1.src}
                    alt="Happy professional"
                    width={160}
                    height={160}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Person 2 */}
                <div className="absolute top-10 right-0 z-20 h-28 w-28 animate-float rounded-2xl bg-purple-500 p-2 shadow-lg [animation-delay:-1s] lg:h-36 lg:w-36">
                  <Image
                    data-ai-hint={placeholderImages.businessHero.person2.hint}
                    src={placeholderImages.businessHero.person2.src}
                    alt="Smiling expert"
                    width={144}
                    height={144}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>

                {/* Person 3 */}
                <div className="absolute bottom-0 left-0 z-20 h-36 w-36 animate-float rounded-2xl bg-blue-500 p-2 shadow-lg [animation-delay:-2s] lg:h-48 lg:w-48">
                  <Image
                    data-ai-hint={placeholderImages.businessHero.person3.hint}
                    src={placeholderImages.businessHero.person3.src}
                    alt="Confident learner"
                    width={192}
                    height={192}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>

                {/* Stat Card */}
                <div className="absolute top-1/3 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform animate-float rounded-2xl bg-foreground p-4 text-background shadow-2xl [animation-delay:-0.5s] lg:p-6">
                  <p className="text-xs lg:text-sm">Active Professionals</p>
                  <p className="text-2xl font-bold lg:text-4xl">13,422</p>
                </div>
                
                {/* Abstract Shapes */}
                <div className="absolute top-1/2 right-1/4 h-20 w-20 animate-float rounded-2xl bg-yellow-300 [animation-delay:-2.5s] lg:h-24 lg:w-24"></div>
                <div className="absolute bottom-10 right-1/2 h-10 w-10 animate-float rounded-full bg-red-500 [animation-delay:-1.5s]"></div>
                <div className="absolute top-5 left-5 h-5 w-5 animate-float rounded-full border-2 border-foreground [animation-delay:-3s]"></div>
                
                {/* Star SVG */}
                <div className="absolute bottom-1/4 right-1/4 z-10 w-16 h-16 animate-float text-foreground [animation-delay:-0.8s]">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0L61.2257 38.7743L100 50L61.2257 61.2257L50 100L38.7743 61.2257L0 50L38.7743 38.7743L50 0Z" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Features />

        {/* --- Volume Discount Calculator --- */}
        <VolumeCalculator />

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
          <div className="container mx-auto max-w-2xl px-4 text-center">
             <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-6">
                <Gift className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              Ready to Start Earning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Applying is quick and easy. Send us an email with a link to your
              blog, website, or social media profile, and we'll get back to
              you within 48 hours.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <a href="https://forms.gle/4rANNRPbBCv15DFFA" target="_blank" rel="noopener noreferrer">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
