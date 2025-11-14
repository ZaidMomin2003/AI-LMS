
'use client';

import 'dotenv/config';
import { useState, forwardRef, useMemo } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { motion, type Variants } from 'framer-motion';
import Script from 'next/script';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { upgradeSubscriptionAction, downgradeToHobbyAction } from './actions';
import { useSubscription } from '@/context/SubscriptionContext';


const allPlans = [
    {
        name: 'Hobby',
        price: '₹0',
        period: 'Free Forever',
        description: 'Perfect for trying out the power of AI learning.',
        priceId: null,
        amount: 0,
        features: [
            { text: '1 Topic Generation', included: true },
            { text: '1 AI Roadmap Generation', included: true },
            { text: '1 Pomodoro Session', included: true },
            { text: '1 Capture the Answer', included: true },
            { text: 'WisdomGPT AI Assistant', included: false },
            { text: 'Priority Support', included: false },
        ],
        buttonText: 'Start for Free',
        href: '/signup',
    },
    {
        name: 'Sage Mode',
        description: 'The ultimate toolkit for dedicated lifelong learners. All features, unlimited.',
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
        tiers: [
            { id: 'SAGE_MODE_YEARLY', name: '1 Year Plan', price: '₹16,500', period: '/year', amount: 16500, billed: 'Billed annually' },
            { id: 'SAGE_MODE_6_MONTHS', name: '6 Month Plan', price: '₹9,900', period: '/6-mo', amount: 9900, billed: 'Billed every 6 months' },
            { id: 'SAGE_MODE_3_MONTHS', name: '3 Month Plan', price: '₹5,700', period: '/3-mo', amount: 5700, billed: 'Billed every 3 months' },
        ],
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


type Tier = {
  id: string;
  name: string;
  price: string;
  period: string;
  amount: number;
  billed: string;
  originalPrice?: string;
  discount?: string;
};

type PricingPlan = {
  name: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  href?: string;
  highlight?: boolean;
  price?: string;
  period?: string;
  priceId?: string | null;
  tiers?: Tier[];
};

interface PriceDisplayProps {
  price: string;
  period: string;
  billed?: string;
  isHighlighted?: boolean;
  className?: string;
}

const PriceDisplay = ({ price, period, billed, isHighlighted, className }: PriceDisplayProps) => {
  const isFree = price.toLowerCase() === '₹0';
  
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
       {billed && (
         <div className="flex items-center gap-2">
            <span className={cn("text-sm", isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground")}>{billed}</span>
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
          <span className={cn(!feature.included && "text-muted-foreground line-through", isHighlighted && 'text-primary-foreground/90')}>{feature.text}</span>
        </li>
      ))}
    </ul>
  );
};

interface PricingCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  plan: PricingPlan;
  onCtaClick: (priceId: string) => void;
  isLoading: string | null;
  onDowngradeClick?: () => void;
  isDowngradeLoading?: boolean;
  showDowngrade?: boolean;
}

const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  ({ plan, onCtaClick, isLoading, onDowngradeClick, isDowngradeLoading, showDowngrade, className, ...props }, ref) => {
    const [selectedTierId, setSelectedTierId] = useState(plan.tiers ? plan.tiers[0].id : null);

    const selectedTier = useMemo(() => {
        return plan.tiers?.find(t => t.id === selectedTierId);
    }, [plan.tiers, selectedTierId]);

    const handleCta = () => {
        if (selectedTier) {
            onCtaClick(selectedTier.id);
        }
    };

    const isCardLoading = isLoading === selectedTier?.id;

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
          <div className="flex items-center justify-between py-2 min-h-[40px]">
            <div className={cn("text-lg font-bold font-headline", plan.highlight ? 'text-primary-foreground' : 'text-foreground')}>
              {plan.name}
            </div>
             {plan.highlight && selectedTier?.originalPrice && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-primary-foreground/80 line-through">{selectedTier.originalPrice}</span>
                    {selectedTier.discount && <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">{selectedTier.discount}</span>}
                </div>
            )}
          </div>
           {plan.tiers && selectedTier ? (
                <>
                    <PriceDisplay price={selectedTier.price} period={selectedTier.period} billed={selectedTier.billed} isHighlighted={plan.highlight} />
                    <Select onValueChange={setSelectedTierId} defaultValue={selectedTierId ?? undefined}>
                        <SelectTrigger className="w-full my-4 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">
                            <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {plan.tiers.map(tier => (
                                <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            ) : (
                 <PriceDisplay price={plan.price!} period={plan.period!} isHighlighted={plan.highlight} />
            )}
          <p className={cn("text-sm mb-6 min-h-[40px]", plan.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
            {plan.description}
          </p>
          <PricingFeatures features={plan.features} isHighlighted={plan.highlight} />
        </div>
        <div className="relative">
          {showDowngrade ? (
              <Button onClick={onDowngradeClick} className="w-full" variant="outline" disabled={isDowngradeLoading}>
                  {isDowngradeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Switch to Free Trial
              </Button>
          ) : plan.href ? (
            <Button asChild className="w-full" variant={plan.highlight ? 'secondary' : 'default'}>
              <Link href={plan.href}>{plan.buttonText}</Link>
            </Button>
          ) : (
             <Button onClick={handleCta} className="w-full" variant={plan.highlight ? 'secondary': 'default'} disabled={isCardLoading}>
                {isCardLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
    const { subscription, setSubscription } = useSubscription();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isDowngradeLoading, setIsDowngradeLoading] = useState(false);

    const handleMockUpgrade = async (priceId: string) => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You must be logged in to upgrade your plan.',
            });
            return;
        }

        setIsLoading(priceId);

        try {
            const result = await upgradeSubscriptionAction(user.uid, priceId);
            if (result.success) {
                // Manually set subscription to trigger context update
                const planDurations: Record<string, number> = {
                    SAGE_MODE_YEARLY: 365,
                    SAGE_MODE_6_MONTHS: 180,
                    SAGE_MODE_3_MONTHS: 90,
                };
                const durationInDays = planDurations[priceId];
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + durationInDays);

                setSubscription({
                    planName: "Sage Mode",
                    status: "active",
                    priceId,
                    expiresAt: expiresAt.toISOString(),
                });
                
                toast({
                    title: 'Upgrade Successful!',
                    description: "Welcome to Sage Mode! Your plan is now active.",
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Upgrade Failed',
                    description: 'Could not upgrade your plan. Please try again.',
                });
            }
        
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'An error occurred',
                description: error.message || 'Something went wrong.',
            });
        } finally {
            setIsLoading(null);
        }
    };
    
    const handleDowngrade = async () => {
        if (!user) return;
        
        setIsDowngradeLoading(true);
        try {
            const result = await downgradeToHobbyAction(user.uid);
            if (result.success) {
                setSubscription({ planName: 'Hobby', status: 'active' });
                toast({
                    title: 'Plan Changed',
                    description: "You've been switched to the Hobby plan.",
                });
            } else {
                toast({ variant: 'destructive', title: 'Update Failed' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'An error occurred' });
        } finally {
            setIsDowngradeLoading(false);
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
                <h1 className="text-center text-9xl md:text-[200px] font-bold text-foreground/5 pointer-events-none">
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
                            plan={plan as PricingPlan}
                            onCtaClick={handleMockUpgrade}
                            isLoading={isLoading}
                            onDowngradeClick={handleDowngrade}
                            isDowngradeLoading={isDowngradeLoading}
                            showDowngrade={plan.name === 'Hobby' && subscription?.planName === 'Sage Mode'}
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
