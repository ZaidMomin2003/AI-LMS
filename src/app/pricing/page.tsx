
'use client';

import 'dotenv/config';
import { useState, forwardRef } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2, X, FileText, BrainCircuit, MessageCircleQuestion, Bot, Map, DollarSign, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { createRazorpayOrder, verifyRazorpayPayment } from './actions';
import { useToast } from '@/hooks/use-toast';
import { motion, type Variants } from 'framer-motion';
import Script from 'next/script';
import type { LucideProps } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HappyFacesBanner } from '@/components/pricing/HappyFacesBanner';

const allPlans = [
    {
        name: 'Hobby',
        price: '$0',
        period: 'Free Forever',
        description: 'Perfect for trying out the power of AI learning.',
        priceId: null,
        amount: 0,
        features: [
            { text: '1 Topic Generation', included: true },
            { text: '1 AI Roadmap Generation', included: true },
            { text: '1 Pomodoro Session', included: true },
            { text: '1 Capture the Answer', included: true },
            { text: 'Basic Support', included: false },
        ],
        buttonText: 'Start for Free',
        href: '/signup',
    },
    {
        name: 'Sage Mode',
        price: '$16.58',
        period: '/ month',
        description: 'The ultimate toolkit for dedicated lifelong learners. All features, unlimited.',
        priceId: 'SAGE_MODE_YEARLY',
        amount: 199, // For Razorpay
        features: [
            { text: 'Unlimited Topic Generations', included: true },
            { text: 'Unlimited AI Roadmaps', included: true },
            { text: 'Unlimited Pomodoro Sessions', included: true },
            { text: 'Unlimited Captures', included: true },
            { text: 'WisdomGPT AI Assistant', included: true },
            { text: 'Priority Support', included: true },
            { text: 'Early access to new features', included: true },
        ],
        buttonText: 'Go Sage Mode',
        highlight: true,
    },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 150,
    },
  },
};


// --- PricingCard and related components moved here ---

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  href?: string;
  highlight?: boolean;
};

interface PriceDisplayProps {
  price: string;
  period: string;
  isHighlighted?: boolean;
  className?: string;
}

const PriceDisplay = ({ price, period, isHighlighted, className }: PriceDisplayProps) => {
  const isFree = price.toLowerCase() === '$0';
  
  return (
    <div className={cn('relative mb-2', className)}>
      <div
        className={cn(
          'mt-2 flex items-baseline gap-1',
           isHighlighted
            ? 'text-primary-foreground'
            : 'text-foreground'
        )}
      >
        {isFree ? (
            <span className="text-5xl font-bold">Free</span>
        ) : (
          <>
            <span className="text-5xl font-bold">{price}</span>
            <span className="text-lg text-muted-foreground">{period}</span>
          </>
        )}
      </div>
      {isHighlighted && (
         <div className="flex items-center gap-2">
            <span className="text-sm text-primary-foreground/80 line-through">$299/year</span>
            <span className="text-sm text-primary-foreground/80">billed annually</span>
            <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">Save 33%</span>
         </div>
      )}
    </div>
  );
};

interface PricingFeaturesProps {
  features: { text: string; included: boolean }[];
  isHighlighted?: boolean;
  className?: string;
}

const PricingFeatures = ({ features, isHighlighted, className }: PricingFeaturesProps) => {
  return (
    <ul className={cn('relative mb-8 space-y-3', className)}>
      {features.map((feature) => (
        <li key={feature.text} className="flex items-center gap-3">
          <div className={cn("rounded-full p-0.5", feature.included ? (isHighlighted ? "bg-primary-foreground/20" : "bg-primary/20") : "bg-muted")}>
            {feature.included ? (
                <Check className={cn("h-4 w-4", isHighlighted ? "text-primary-foreground" : "text-primary")} />
            ) : (
                <X className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className={cn(!feature.included && "text-muted-foreground line-through")}>{feature.text}</span>
        </li>
      ))}
    </ul>
  );
};

interface PricingCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  plan: PricingPlan;
  onCtaClick: () => void;
  isLoading: boolean;
}

const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  ({ plan, onCtaClick, isLoading, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative flex flex-col justify-between overflow-hidden rounded-2xl p-6',
          'shadow-[inset_0_1px_30px_0_rgba(255,255,255,0.1)]',
          plan.highlight
            ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30'
            : 'border-border/50 border bg-background/20 backdrop-blur-sm',
           !plan.highlight && "before:absolute before:inset-0 before:-z-10 before:content-['']",
          !plan.highlight && 'before:bg-gradient-to-br before:from-white/7 before:to-transparent',
          !plan.highlight && 'before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
           !plan.highlight && "after:absolute after:inset-0 after:-z-20 after:content-['']",
          !plan.highlight && 'after:opacity-70',
          !plan.highlight && 'hover:border-border/70 hover:shadow-lg',
           !plan.highlight && 'after:bg-[radial-gradient(circle_at_75%_25%,hsl(var(--primary)/.05),transparent_70%)]',
          className
        )}
        whileHover={{ y: -8 }}
        {...props}
      >
        <div>
          <div className="py-2">
            <div className={cn("text-sm font-medium", plan.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
              {plan.name}
            </div>
          </div>
          <PriceDisplay price={plan.price} period={plan.period} isHighlighted={plan.highlight} />
          <p className={cn("text-sm mb-6 min-h-[40px]", plan.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
            {plan.description}
          </p>
          <PricingFeatures features={plan.features} isHighlighted={plan.highlight} />
        </div>
        <div className="relative">
          {plan.href ? (
            <Button asChild className="w-full" variant={plan.highlight ? 'secondary' : 'default'}>
              <Link href={plan.href}>{plan.buttonText}</Link>
            </Button>
          ) : (
             <Button onClick={onCtaClick} className="w-full" variant={plan.highlight ? 'secondary': 'default'} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {plan.buttonText}
            </Button>
          )}
        </div>
      </motion.div>
    );
  }
);
PricingCard.displayName = 'PricingCard';


const PricingContent = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handlePayment = async (amount: number) => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You must be logged in to subscribe.',
            });
            return;
        }

        setIsLoading('SAGE_MODE_YEARLY');

        try {
            const order = await createRazorpayOrder(amount, user.uid);
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Wisdomis Fun',
                description: 'Sage Mode Yearly Subscription',
                order_id: order.id,
                handler: async function (response: any) {
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        uid: user.uid,
                    };

                    const result = await verifyRazorpayPayment(verificationData);

                    if (result.success) {
                        toast({
                            title: 'Payment Successful!',
                            description: 'Welcome to Sage Mode! Your subscription is now active.',
                        });
                         // You might want to refresh subscription context or redirect here
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Payment Verification Failed',
                            description: 'Please contact support.',
                        });
                    }
                },
                prefill: {
                    name: user.displayName || 'Wisdomis Fun User',
                    email: user.email || '',
                },
                theme: {
                    color: '#4B0082',
                },
            };
            
            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();
        
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: error.message || 'Could not initiate payment. Please try again.',
            });
        } finally {
            setIsLoading(null);
        }
    };
    
    return (
        <>
        <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <section id="pricing" className="relative w-full overflow-hidden py-20 sm:py-32">
             <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <h1 className="text-center text-12xl font-bold text-foreground/5 pointer-events-none">
                    Pricing
                </h1>
            </div>

            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-headline">
                      Choose Your Plan
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Start for free, then unlock more power as you grow. Simple, transparent pricing for every learner.
                    </p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className={cn("relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-2 mb-20")}>
                    {allPlans.map((plan) => (
                         <PricingCard 
                            key={plan.name} 
                            variants={itemVariants}
                            plan={{
                                name: plan.name,
                                price: plan.price,
                                period: plan.period,
                                description: plan.description,
                                features: plan.features,
                                buttonText: plan.buttonText,
                                href: plan.href,
                                highlight: plan.highlight
                            }}
                            onCtaClick={() => plan.priceId && handlePayment(plan.amount)}
                            isLoading={isLoading === plan.priceId}
                        />
                    ))}
                </motion.div>
            </div>
         </section>
         </>
    )
}

export default function PricingPage() {
  const { user, loading } = useAuth();
  
  if (loading) {
      return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
        <AppLayout>
            <main className="flex-grow">
                <PricingContent />
            </main>
        </AppLayout>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}

    
