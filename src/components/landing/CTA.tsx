import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-24 bg-background">
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
                <h1 className="mb-3 text-3xl font-bold text-primary-foreground sm:text-4xl md:mb-4 md:text-5xl font-headline">
                    Get Started with Wisdomis Fun Today
                </h1>
                <p className="mb-6 max-w-md text-base text-primary-foreground/90 sm:text-lg md:mb-8">
                    Join the first 100 users and get 50% off your first subscription. Plus, every new account gets a free trial on us.
                </p>
                
                <Button asChild className="group flex w-full items-center justify-between rounded-full bg-card px-6 py-6 text-card-foreground shadow-lg sm:w-[280px] hover:bg-card/90 transition-transform hover:scale-105">
                   <Link href="/signup">
                     <span className="font-bold text-lg">Claim Free Trial</span>
                     <span className="h-8 w-8 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:rotate-45">
                        <ArrowRight className="w-5 h-5"/>
                     </span>
                   </Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
