
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
import { motion } from 'framer-motion';

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

const images = [
  placeholderImages.businessHero.person1,
  placeholderImages.businessHero.person2,
  placeholderImages.businessHero.person3,
  {
    "src": "https://picsum.photos/seed/person-male-2/192/192",
    "hint": "smiling man"
  },
  {
    "src": "https://picsum.photos/seed/person-female-3/192/192",
    "hint": "professional woman"
  },
  {
    "src": "https://picsum.photos/seed/person-male-3/192/192",
    "hint": "professional man"
  }
];


export default function BusinessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative w-full overflow-hidden bg-secondary/20 py-20 lg:py-28">
          <div className="container relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <p className="font-semibold uppercase tracking-wider text-primary">
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
            </motion.div>

            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="relative grid h-[450px] grid-cols-3 grid-rows-3 gap-4"
            >
              {images.map((image, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, zIndex: 10, rotate: i % 2 === 0 ? -5 : 5, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                  className="relative overflow-hidden rounded-2xl border-2 border-background/50 shadow-lg"
                  style={{
                    gridRow: i < 3 ? 'span 1' : 'span 2',
                    gridColumn: i % 3 === 0 ? 'span 1' : (i % 3 === 1 ? 'span 1' : 'span 1'),
                    ...(i === 1 && { gridRow: 'span 2' }),
                    ...(i === 3 && { gridColumn: 'span 2', gridRow: 'span 1' }),
                  }}
                >
                  <Image
                    src={image.src}
                    alt="Happy partner"
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300"
                    data-ai-hint={image.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent" />
                </motion.div>
              ))}
            </motion.div>
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
