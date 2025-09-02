
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Bot, BrainCircuit, CheckCircle, GraduationCap, Loader2, Map, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { submitPartnerInquiry } from './actions';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your full name.' }),
  designation: z.string().min(2, { message: 'Please enter your designation.' }),
  organization: z.string().min(2, { message: 'Please enter your organization\'s name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  whatsapp: z.string().min(10, { message: 'Please enter a valid WhatsApp number.' }),
});

type FormValues = z.infer<typeof formSchema>;

const benefits = [
    { icon: Bot, text: 'Provide a 24/7 AI tutor for every student.' },
    { icon: BrainCircuit, text: 'Generate unlimited, high-quality study materials instantly.' },
    { icon: Map, text: 'Create personalized learning roadmaps for entire classes.' },
    { icon: Users, text: 'Boost student engagement and improve academic outcomes.' },
];

export default function BecomePartnerPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            designation: '',
            organization: '',
            email: '',
            whatsapp: '',
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        const result = await submitPartnerInquiry(values);
        if (result.success) {
            toast({
                title: 'Inquiry Sent!',
                description: result.message,
            });
            form.reset();
        } else {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: result.message,
            });
        }
        setIsLoading(false);
    }


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
                        <div className="flex items-center">
                            <Card className="w-full shadow-2xl shadow-primary/10 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">Let's Collaborate</CardTitle>
                                    <CardDescription>Fill out this form and we'll be in touch to discuss a partnership.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                 <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Full Name</FormLabel>
                                                            <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                 <FormField
                                                    control={form.control}
                                                    name="designation"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Designation</FormLabel>
                                                            <FormControl><Input placeholder="e.g., Principal, Teacher" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                             <FormField
                                                control={form.control}
                                                name="organization"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>School / Organization</FormLabel>
                                                        <FormControl><Input placeholder="Your School's Name" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                 <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl><Input type="email" placeholder="you@yourschool.com" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                 <FormField
                                                    control={form.control}
                                                    name="whatsapp"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>WhatsApp Number</FormLabel>
                                                            <FormControl><Input type="tel" placeholder="+91..." {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={isLoading}>
                                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Submit Inquiry
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
