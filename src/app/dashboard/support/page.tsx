
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { submitSupportRequest } from './actions';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  queryType: z.string({ required_error: 'Please select a query type.' }),
  message: z.string().min(10, 'Your message must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      message: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await submitSupportRequest(values);
      toast({
        title: 'Request Submitted!',
        description: 'Thank you for reaching out. We will get back to you within 24 hours.',
      });
      form.reset({ ...values, message: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an issue submitting your request. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="flex-1 relative overflow-hidden bg-background">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

        <div className="relative z-10 p-4 md:p-8 pt-6 max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter leading-none">
              Get <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Support</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium opacity-70">
              Direct access to our neural assistance grid. Response latency: &lt; 24h.
            </p>
          </div>

          <Card className="bg-card/40 backdrop-blur-xl border-border/10 shadow-2xl rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <CardHeader className="pb-4">
              <CardTitle className="font-black text-2xl tracking-tighter uppercase opacity-80">Transmission Terminal</CardTitle>
              <CardDescription className="font-medium opacity-60">
                Provide detailed telemetry regarding your inquiry for prioritized synthesis.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all" />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all" />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="queryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Inquiry Classification</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/20 border-border/10 rounded-2xl h-12 md:h-14 px-4 font-bold focus:ring-primary/20 transition-all">
                              <SelectValue placeholder="Select classification" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-border/10 bg-background/95 backdrop-blur-3xl">
                            <SelectItem value="billing-issue">Billing & Logistics</SelectItem>
                            <SelectItem value="technical-problem">Kernel Exceptions</SelectItem>
                            <SelectItem value="feature-request">Neural Expansion</SelectItem>
                            <SelectItem value="general-question">General Query</SelectItem>
                            <SelectItem value="other">Misc. Transmission</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Telemetry Data</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your situation in high-fidelity detail..."
                            className="bg-background/20 border-border/10 rounded-2xl min-h-[150px] p-4 font-bold focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-border/5">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Transmit Request'}
                    </Button>
                    <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 hover:text-white transition-all">
                      <Link href="https://wa.link/o0dcmr" target="_blank" className="flex items-center justify-center">
                        Secure WhatsApp Bridge
                      </Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
