
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { featuresData, type Feature } from '@/lib/roadmap-data';
import { Map, ArrowRight, CheckCircle, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const upcomingFeatures = [
  'Highlight and save notes directly',
  'Add sticky notes to documents',
  'Translate materials to any language',
  'Talk with your PDF documents',
  'Voice-based interactive tutor',
  'Advanced analytics on study habits',
];

export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_80%)]" />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Column: Upcoming Features */}
              <div className="relative z-10 rounded-2xl border bg-background/50 p-8 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline text-foreground">
                        What's Next?
                    </h2>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                    We're constantly innovating. Here are some of the exciting features you can expect to experience in the near future.
                </p>
                <ul className="space-y-3">
                  {upcomingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                 <Button asChild className="mt-8 w-full">
                    <a href="https://wa.link/o0dcmr" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Request a Feature
                    </a>
                </Button>
              </div>

              {/* Right Column: Original Hero */}
              <div className="relative z-10 text-center md:text-left">
                  <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-6">
                    <Map className="w-10 h-10" />
                  </div>
                  <h1 className="font-headline mt-4 text-4xl font-bold text-foreground sm:text-6xl">
                    Our Development Journey
                  </h1>
                  <p className="mt-6 text-lg text-muted-foreground">
                    From a simple idea to a powerful learning toolkit. Explore the timeline of how Wisdom was built, feature by feature.
                  </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Timeline Section --- */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border/70" />
              
              <div className="space-y-12">
                {featuresData.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline Dot */}
                      <div className="flex-shrink-0 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center z-10">
                        <div className="w-4 h-4 bg-primary rounded-full" />
                      </div>
                      
                      <div className="ml-8 w-full">
                        <p className="text-sm text-muted-foreground mb-1">{feature.date}</p>
                        <div className="p-6 bg-card border rounded-xl shadow-sm">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-headline font-bold">{feature.title}</h3>
                                {feature.status === 'Launched' ? (
                                    <span className="text-xs font-semibold text-green-500">{feature.status}</span>
                                ) : (
                                    <span className="text-xs font-semibold text-amber-500">{feature.status}</span>
                                )}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl bg-primary p-10 text-center">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">
                  Ready to Experience the Future of Learning?
                </h2>
                <p className="mt-4 max-w-md mx-auto text-base text-primary-foreground/90 sm:text-lg">
                  All these features are live and waiting for you. Start your journey to academic success today.
                </p>
                 <Button asChild size="lg" className="mt-8 bg-card text-card-foreground hover:bg-card/90 shadow-lg">
                    <Link href="/signup">
                        Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
