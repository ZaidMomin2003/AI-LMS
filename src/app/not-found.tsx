
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, SearchX, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-md text-center">
          <div 
            aria-hidden="true" 
            className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" 
          />
          <SearchX className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Page Not Found
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Oops! It seems you've wandered off the beaten path. The page you're looking for doesn't exist.
          </p>
          
          <div className="mt-10 rounded-lg border bg-card/50 p-6 text-left shadow-lg backdrop-blur-sm">
             <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold font-headline">Don't Leave Empty-Handed!</h3>
             </div>
             <p className="mt-3 text-sm text-muted-foreground">
                While you're here, why not discover the AI-powered tools that can revolutionize your study habits?
             </p>
              <Button asChild className="w-full mt-4">
                <Link href="/signup">
                  Sign Up for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </div>

          <div className="mt-6">
            <Button asChild variant="ghost">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go back home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
