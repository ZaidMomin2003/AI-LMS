
'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Star, FileText, BrainCircuit, MessageCircleQuestion, Bot, Map, DollarSign, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  highlight?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: 'Hobby',
    price: '₹0',
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
    price: '₹199/year',
    description: 'The ultimate toolkit for dedicated lifelong learners.',
    features: [
      'Unlimited Topic Generations',
      'Unlimited AI Roadmaps',
      'Unlimited Pomodoro Sessions',
      'Unlimited Captures',
      'SageMaker AI Assistant',
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
  className?: string;
}

const PriceDisplay = ({ price, className }: PriceDisplayProps) => {
  const isFree = price.toLowerCase() === '₹0';
  const [amount, period] = price.split('/');

  return (
    <div className={cn('relative mb-8', className)}>
      <div
        className={cn(
          'mt-2 text-6xl font-bold',
          'from-foreground bg-gradient-to-r to-transparent bg-clip-text text-transparent'
        )}
      >
        {isFree ? (
          <span>Free</span>
        ) : (
          <>
            <span>{amount}</span>
            {period && <span className="text-xl">/{period}</span>}
          </>
        )}
      </div>
    </div>
  );
};

interface PricingFeaturesProps {
  features: string[];
  className?: string;
}

const PricingFeatures = ({ features, className }: PricingFeaturesProps) => {
  return (
    <ul className={cn('relative mb-8 space-y-3', className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-center">
          <div className="bg-foreground/10 shadow-foreground/50 mr-3 rounded-full p-1 shadow-inner">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
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
          'border-border/50 border',
          'bg-background/20 backdrop-blur-sm',
          'shadow-[inset_0_1px_30px_0_rgba(255,255,255,0.1)]',
          "before:absolute before:inset-0 before:-z-10 before:content-['']",
          'before:bg-gradient-to-br before:from-white/7 before:to-transparent',
          'before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
          "after:absolute after:inset-0 after:-z-20 after:content-['']",
          'after:opacity-70',
          'hover:border-border/70 hover:shadow-lg',
           plan.highlight
            ? 'after:bg-[radial-gradient(circle_at_75%_25%,hsl(var(--primary)/0.2),transparent_40%)]'
            : 'after:bg-[radial-gradient(circle_at_75%_25%,hsl(var(--primary)/0.05),transparent_70%)]',
          className
        )}
        whileHover={{ y: -8 }}
        {...props}
      >
        <div>
          <div className="py-2">
            <div className="text-muted-foreground text-sm font-medium">
              {plan.name}
            </div>
          </div>
          <PriceDisplay price={plan.price} />
          <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{plan.description}</p>
          <PricingFeatures features={plan.features} />
        </div>
        <div className="relative">
          <Button
            asChild
            className={cn(
              'w-full',
              plan.highlight
                ? 'after:bg-primary/80 relative after:absolute after:-z-10 after:h-full after:w-full after:blur-xs'
                : 'bg-secondary text-secondary-foreground'
            )}
            variant={plan.highlight ? 'default' : 'secondary'}
          >
            <Link href={plan.link}>{plan.cta}</Link>
          </Button>
        </div>
      </motion.div>
    );
  }
);
PricingCard.displayName = 'PricingCard';


const comparisonFeatures = [
    { name: 'AI Note Generation', icon: FileText, wisdomis: true, learnsphere: true, quizwiz: false },
    { name: 'AI Flashcards', icon: BrainCircuit, wisdomis: true, learnsphere: true, quizwiz: true },
    { name: 'AI Quizzes', icon: MessageCircleQuestion, wisdomis: true, learnsphere: true, quizwiz: true },
    { name: 'AI Chat Tutor', icon: Bot, wisdomis: true, learnsphere: true, quizwiz: false },
    { name: 'AI Roadmap Planner', icon: Map, wisdomis: true, learnsphere: false, quizwiz: false },
    { name: 'Dedicated Support', icon: Check, wisdomis: true, learnsphere: true, quizwiz: false },
];

const competitors = [
    { name: 'Wisdomis Fun', price: '₹199/year', logo: Sparkles },
    { name: 'LearnSphere', price: '$20/month', logo: null },
    { name: 'QuizWiz AI', price: '$10/month', logo: null },
];

const ComparisonTable = () => (
    <section className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-headline">
                    Unbeatable Value
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    Get more features for a fraction of the cost. Wisdomis Fun is designed to be powerful, not pricey.
                </p>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-max mx-auto bg-card border rounded-2xl p-6 shadow-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-4 text-left font-headline text-lg w-1/3">Features</th>
                                {competitors.map((comp, i) => (
                                    <th key={comp.name} className={cn("p-4 text-center w-1/4", i === 0 && "rounded-t-lg bg-primary/10")}>
                                        <div className="flex flex-col items-center gap-1">
                                            {comp.logo ? <comp.logo className="w-6 h-6 text-primary"/> : <span className="font-bold">{comp.name}</span>}
                                            {i === 0 && <span className="font-bold">{comp.name}</span>}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonFeatures.map((feature) => (
                                <tr key={feature.name} className="border-b last:border-none hover:bg-secondary/50">
                                    <td className="p-4 flex items-center gap-3">
                                        <feature.icon className="w-5 h-5 text-muted-foreground" />
                                        <span className="font-medium">{feature.name}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                                    </td>
                                    <td className="p-4 text-center">
                                        {feature.learnsphere ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feature.quizwiz ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t-2">
                                <td className="p-4 font-headline text-lg flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                                    Pricing
                                </td>
                                <td className="p-4 text-center font-bold text-lg bg-primary/10 rounded-b-lg">
                                    <div className="flex flex-col">
                                        <span>₹199</span>
                                        <span className="text-xs font-normal text-primary">per year</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold text-lg text-muted-foreground">
                                     <div className="flex flex-col">
                                        <span>$20</span>
                                        <span className="text-xs font-normal">per month</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold text-lg text-muted-foreground">
                                     <div className="flex flex-col">
                                        <span>$10</span>
                                        <span className="text-xs font-normal">per month</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
          className="relative z-10 grid max-w-4xl mx-auto gap-8 md:grid-cols-2 mt-16"
        >
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} variants={itemVariants} plan={plan} />
          ))}
        </motion.div>
      </div>
      <ComparisonTable />
    </div>
  );
}
