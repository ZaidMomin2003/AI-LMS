
'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  highlight?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: 'Hobby',
    price: '$0',
    period: 'Free Forever',
    description: 'Perfect for trying out the power of AI learning.',
    features: [
      '1 Topic Generation',
      '1 AI Roadmap',
      '1 Pomodoro Session',
      '1 Capture the Answer',
      'Basic Support',
    ],
    cta: 'Start for Free',
    link: '/signup',
  },
  {
    name: 'Sage Mode',
    price: '$16.58',
    period: '/ month',
    description: 'The ultimate toolkit for dedicated lifelong learners.',
    features: [
      'Unlimited Topic Generations',
      'Unlimited AI Roadmaps',
      'Unlimited Pomodoro Sessions',
      'Unlimited Captures',
      'WisdomGPT AI Assistant',
      'Priority Support',
      'Early access to new features',
    ],
    cta: 'Go Sage Mode',
    link: '/pricing',
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
  features: string[];
  isHighlighted?: boolean;
  className?: string;
}

const PricingFeatures = ({ features, isHighlighted, className }: PricingFeaturesProps) => {
  return (
    <ul className={cn('relative mb-8 space-y-3', className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-center">
          <div className={cn(
              "mr-3 rounded-full p-1 shadow-inner",
               isHighlighted
                ? 'bg-primary-foreground/10 shadow-black/20'
                : 'bg-foreground/10 shadow-foreground/50'
          )}>
            <Check className={cn("h-4 w-4", isHighlighted ? "text-primary-foreground" : "text-primary")} />
          </div>
          <span className={cn(isHighlighted && 'text-primary-foreground/90')}>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

// --- New Animated Button Component ---
const TARGET_TEXT = "Go Sage Mode";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const ScrambleButton = () => {
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = React.useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];
          return randomChar;
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    setText(TARGET_TEXT);
  };
  
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="group relative w-full overflow-hidden rounded-md border-[1px] border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 font-mono font-medium uppercase text-primary-foreground/80 transition-colors hover:text-white"
    >
      <div className="relative z-10 flex items-center gap-2">
        <Sparkles />
        <span>{text}</span>
      </div>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-primary/0 via-primary/50 to-primary/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};


interface PricingCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  plan: PricingPlan;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ plan, className, ...props }, ref) => {
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
          {plan.highlight ? (
             <Link href={plan.link}>
                <ScrambleButton />
             </Link>
          ) : (
            <Button
              asChild
              className='w-full'
              variant='secondary'
            >
              <Link href={plan.link}>{plan.cta}</Link>
            </Button>
          )}
        </div>
      </motion.div>
    );
  }
);
PricingCard.displayName = 'PricingCard';


const oldWayFeatures = [
    { name: 'AI Note Generation', via: 'Notion AI', cost: 96 },
    { name: 'AI Flashcard Creation', via: 'Quizlet Plus', cost: 36 },
    { name: 'AI Quiz Generation', via: 'QuillBot Premium', cost: 100 },
    { name: 'Personal AI Tutor (WisdomGPT)', via: 'Chegg Study Pack', cost: 240 },
    { name: 'AI Roadmap Generation', via: 'Custom Tutoring Plan', cost: 500 },
    { name: 'Task Management Board', via: 'Trello Premium', cost: 60 },
    { name: 'Pomodoro Timer', via: 'Focus Keeper Pro', cost: 2 },
    { name: 'Capture the Answer', via: 'Photomath Plus', cost: 120 },
];

const wisdomisWayFeatures = [
    'AI Note Generation',
    'AI Flashcard Creation',
    'AI Quiz Generation',
    'Personal AI Tutor (WisdomGPT)',
    'AI Roadmap Generation',
    'Task Management Board',
    'Pomodoro Timer',
    'Capture the Answer',
];

const totalOldWayCost = oldWayFeatures.reduce((acc, feature) => acc + feature.cost, 0);
const wisdomisCost = 199;

const ValueComparison = () => (
    <section className="bg-background py-0">
        <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-headline">
                    All Your Study Tools in One Place
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    Getting all these features separately would be a hassle—and expensive. Wisdomis Fun bundles everything you need into one powerful, affordable platform.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* The Old Way */}
                <Card className="bg-card p-6 rounded-2xl shadow-lg h-full">
                    <CardContent className="p-0">
                        <h3 className="font-headline text-xl font-bold">The Old Way: A patchwork of apps</h3>
                        <p className="text-muted-foreground text-sm mt-1 mb-6">Juggling multiple subscriptions adds up quickly.</p>
                        <div className="space-y-3">
                            {oldWayFeatures.map(feature => (
                                <div key={feature.name} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium">{feature.name}</p>
                                        <p className="text-xs text-muted-foreground">via {feature.via}</p>
                                    </div>
                                    <p className="font-semibold">${feature.cost}<span className="text-xs text-muted-foreground">/yr</span></p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* The Wisdomis Fun Way & Cost */}
                <div className="space-y-8">
                    <Card className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-2xl shadow-primary/30">
                        <CardContent className="p-0">
                            <h3 className="font-headline text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5"/> The Wisdomis Fun Way</h3>
                            <p className="text-primary-foreground/80 text-sm mt-1 mb-6">Everything included. One simple plan.</p>
                             <ul className="space-y-3">
                                {wisdomisWayFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="w-5 h-5" />
                                        <span className="font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-card p-6 rounded-2xl shadow-lg">
                        <CardContent className="p-0 text-center">
                            <h3 className="font-headline text-lg font-bold">Estimated Annual Cost</h3>
                            <div className="flex justify-center items-baseline gap-8 my-4">
                                <div>
                                    <p className="text-4xl font-bold text-red-500 line-through">${totalOldWayCost.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">The Old Way</p>
                                </div>
                                <div>
                                    <p className="text-5xl font-bold text-primary">${wisdomisCost}</p>
                                    <p className="text-sm text-muted-foreground">per year</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                With Wisdomis Fun, you get a comprehensive, all-in-one platform for a fraction of the cost.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </section>
);


export function Pricing() {
  return (
    <div id="pricing" className="relative w-full overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <h1 className="text-center text-12xl font-bold text-foreground/5 pointer-events-none">
                Pricing
            </h1>
        </div>

      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
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
          className="relative z-10 grid max-w-4xl mx-auto gap-8 md:grid-cols-2 mt-16 mb-20"
        >
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} variants={itemVariants} plan={plan} />
          ))}
        </motion.div>
      </div>
      <ValueComparison />
    </div>
  );
}

    

    
