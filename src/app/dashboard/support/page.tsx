
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
