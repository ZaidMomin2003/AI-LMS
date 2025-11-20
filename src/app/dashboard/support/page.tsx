
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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.75 13.96c.25.13.43.2.5.28.07.08.15.18.22.33.07.15.03.3.01.46-.02.15-.23.28-.48.36-.25.08-.5.1-.78.08-.28-.03-.55-.08-.83-.16-.28-.08-.53-.2-.78-.36-.25-.16-.5-.35-.73-.58-.23-.23-.45-.48-.65-.75-.2-.27-.38-.56-.53-.86-.15-.3-.25-.6-.3-.9.05-.28.18-.53.38-.73.2-.2.43-.33.68-.38.25-.05.48-.03.68.03.2.05.35.1.45.13l.1.05c.1.05.18.1.25.15s.13.1.15.13.05.05.08.08c.03.03.05.05.08.08l.08.08c.03.03.05.05.08.08.03.03.05.05.08.08h.08c.03.03.05.05.08.08.03.03.05.05.08.08v.08c.03.03.05.05.08.08.03.03.05.05.08.08.03.03.05.05.08.08l.08.08c.03.03.05.05.08.08s.13.1.15.13.1.1.13.15.1.1.13.15.1.1.13.15.1.1.13.15zm-5.18-8.3c-3.3 0-6 2.7-6 6s2.7 6 6 6c3.3 0 6-2.7 6-6s-2.7-6-6-6zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
  </svg>
);


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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold tracking-tight">
            Get Support
          </h2>
          <p className="text-muted-foreground">
            We're just one click away. Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Request</CardTitle>
            <CardDescription>
              Please provide as much detail as possible so we can assist you effectively.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="queryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Query Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the nature of your problem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="billing-issue">Billing Issue</SelectItem>
                          <SelectItem value="technical-problem">Technical Problem</SelectItem>
                          <SelectItem value="feature-request">Feature Request</SelectItem>
                          <SelectItem value="general-question">General Question</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your issue or question in detail here..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                  </Button>
                  <Button asChild variant="outline" className="bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-600">
                    <Link href="https://wa.link/9utpte" target="_blank">
                      <WhatsAppIcon className="mr-2 h-5 w-5" />
                      Chat on WhatsApp
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
