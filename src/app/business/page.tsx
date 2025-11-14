
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
import { ArrowRight, Check, DollarSign, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  'AI-Generated Notes, Flashcards & Quizzes',
  'Personal AI Tutor Chat (WisdomGPT)',
  'AI-Powered Study Roadmaps',
  'Kanban-Style Study Planner',
  'Pomodoro Timers & Exam Countdowns',
  'And much more...',
];

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
        <section className="relative overflow-hidden bg-secondary/50 py-20 md:py-32">
          <div className="absolute inset-0 z-0 opacity-20 bg-grid-pattern"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-secondary/30 via-secondary/70 to-secondary/50"></div>
          <div className="container relative z-20 mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
              Partner with Wisdom
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Join our mission to make learning smarter, not harder. Earn by
              sharing the most advanced AI-powered study toolkit with your
              audience.
            </p>
            <Card className="mx-auto mt-10 inline-flex flex-col items-center gap-4 rounded-2xl bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex items-baseline font-bold text-primary">
                <span className="text-7xl font-headline">$39</span>
              </div>
              <p className="text-lg font-medium text-muted-foreground">
                Commission Per Successful Referral
              </p>
            </Card>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link href="https://forms.gle/4rANNRPbBCv15DFFA" target="_blank" rel="noopener noreferrer">
                  Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                An Easy Sell
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                A Product Your Audience Will Love
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Wisdom is packed with cutting-edge features that solve
                real problems for students and learners, making it a valuable
                recommendation.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-lg">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 rounded-lg border bg-secondary/30 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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
                <Link href="https://forms.gle/4rANNRPbBCv15DFFA" target="_blank" rel="noopener noreferrer">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
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
