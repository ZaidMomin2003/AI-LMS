import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const plans = [
    {
        name: 'Hobby',
        price: '$0',
        period: 'One-time use',
        description: 'Perfect for trying out the power of AI learning.',
        features: [
            '1 Topic Generation',
            'Generate Study Notes',
            'Generate Flashcards',
            'Generate a Quiz'
        ],
        buttonText: 'Start for Free',
        href: '/signup',
    },
    {
        name: 'Student',
        price: '$7',
        period: '/ week',
        description: 'Ideal for short-term projects and exam cramming.',
        features: [
            'Unlimited Topic Generations',
            'Everything in Hobby',
            'Export to Markdown',
            'Email Support'
        ],
        buttonText: 'Choose Plan',
        href: '/signup',
    },
    {
        name: 'Scholar',
        price: '$19',
        period: '/ month',
        description: 'The complete toolkit for dedicated learners.',
        features: [
            'Everything in Student',
            'Advanced Quiz Options',
            'Summarization Feature',
            'Priority Support'
        ],
        buttonText: 'Choose Plan',
        href: '/signup',
        popular: true,
    },
    {
        name: 'Sage',
        price: '$169',
        period: '/ year',
        description: 'For the committed lifelong learner. Save over 20%!',
        features: [
            'Everything in Scholar',
            'Early access to new features',
            'Save 2 months',
            'Dedicated Support Channel'
        ],
        buttonText: 'Choose Plan',
        href: '/signup',
        bestValue: true,
    },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
         <section id="pricing" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Choose Your Plan
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Start for free, then unlock more power as you grow. Simple, transparent pricing for every learner.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-8 lg:max-w-none lg:grid-cols-4">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={cn("relative flex flex-col", plan.popular ? "border-2 border-primary shadow-lg shadow-primary/20" : "")}>
                            {plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Star className="w-4 h-4" />
                                        Most Popular
                                    </div>
                                </div>
                            )}
                            {plan.bestValue && !plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                        Best Value
                                    </div>
                                </div>
                            )}
                            <CardHeader className="pt-12">
                                <CardTitle className="font-headline">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                                    <Link href={plan.href}>{plan.buttonText}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
         </section>
      </main>
      <Footer />
    </div>
  );
}
