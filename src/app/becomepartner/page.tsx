
'use client';

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Bot, BrainCircuit, Calendar, Users, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PartnerWorkflow } from '@/components/partner/PartnerWorkflow';
import { PartnerFeatures } from '@/components/partner/PartnerFeatures';
import { PartnerFAQ } from '@/components/partner/PartnerFAQ';
import { PartnerCTA } from '@/components/partner/PartnerCTA';
import { PartnerChatbot } from '@/components/partner/PartnerChatbot';
import { PartnerVideo } from '@/components/partner/PartnerVideo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const benefits = [
    { icon: Bot, text: 'Provide a 24/7 AI tutor for every student.' },
    { icon: BrainCircuit, text: 'Generate unlimited, high-quality study materials instantly.' },
    { icon: Map, text: 'Create personalized learning roadmaps for entire classes.' },
    { icon: Users, text: 'Boost student engagement and improve academic outcomes.' },
];

export default function BecomePartnerPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <section className="relative container mx-auto px-4 py-16 md:py-24">
                     <div 
                        aria-hidden="true" 
                        className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" 
                    />
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
                                Wisdomis.fun <span className="text-primary">X</span> Your School
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl">
                                Revolutionize your institution's learning experience. By partnering with Wisdomis Fun, you can provide every student with powerful AI-driven tools designed to enhance understanding, boost grades, and foster a love for learning.
                            </p>
                            <div className="mt-10 space-y-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="bg-primary/10 text-primary p-2 rounded-full">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium">{benefit.text}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div id="contact-form" className="flex items-center">
                            <Card className="w-full shadow-2xl shadow-primary/10 border-primary/20">
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-2">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="font-headline text-2xl">Ready to Collaborate?</CardTitle>
                                    <CardDescription>Let's find 40 minutes to connect. Book a demo to see how Wisdomis Fun can empower your students.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <Button asChild size="lg">
                                        <Link href="/signup">Create an Account</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <PartnerChatbot />
                <PartnerVideo />
                <PartnerWorkflow />
                <PartnerFeatures />
                <PartnerFAQ />
                <PartnerCTA />

            </main>
            <Footer />
        </div>
    );
}
