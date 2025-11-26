
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl bg-[#111115] p-12 sm:p-20 text-center">
            {/* Left Crescent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/80 rounded-full blur-3xl opacity-20" />
             {/* Right Crescent */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/80 rounded-full blur-3xl opacity-20" />

            <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Get Started Today</span>
                </div>

                <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl font-headline">
                    Start your free trial today
                </h1>
                <p className="mb-8 max-w-xl mx-auto text-base text-white/70 sm:text-lg">
                    Join now and get a free trial. Get Wisdom is Fun at the lowest cost now, pricing is increasing soon.
                </p>
                
                <Button asChild size="lg">
                   <Link href="/signup">
                     Claim Free Trial
                     <ArrowRight className="ml-2 w-4 h-4"/>
                   </Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
