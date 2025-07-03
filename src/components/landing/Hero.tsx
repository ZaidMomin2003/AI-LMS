import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center sm:py-32">
      <div className="flex justify-center mb-4">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-ring/50 hover:ring-ring">
          Announcing our new AI-powered learning tools. <a href="#features" className="whitespace-nowrap font-semibold text-primary"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-6xl">
        Unlock Your Learning Potential with AI
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">
        ScholarAI instantly transforms any topic into comprehensive study notes, interactive flashcards, and challenging quizzes.
        <br />
        Stop searching, start learning.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild size="lg">
          <Link href="/signup">
            Get Started for Free
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <a href="#features">
            Learn More <span aria-hidden="true">→</span>
          </a>
        </Button>
      </div>
      <div className="relative mt-16 flow-root">
        <div className="absolute -top-12 left-1/2 -z-10 h-40 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="mx-auto max-w-5xl rounded-lg border bg-card/50 p-2 shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                    <Bot className="text-primary"/>
                    <p className="text-sm font-medium text-foreground">What do you want to learn about today?</p>
                </div>
                <Zap className="text-accent"/>
            </div>
            <div className="p-4">
                <p className="text-left text-muted-foreground">The French Revolution</p>
            </div>
        </div>
      </div>
    </section>
  );
}
