'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import { Loader2, Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const ContactInfoItem = ({ icon, text, href }: { icon: React.ReactNode, text: string, href: string }) => (
    <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground rounded-full p-3">
            {icon}
        </div>
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">{text}</a>
    </div>
);


export function Contact() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      form.reset();
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. We'll get back to you shortly.",
      });
      console.log(values);
    }, 1500);
  }

  return (
    <section id="contact" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
            
            {/* Left Column: Form */}
            <div className="space-y-8">
                 <h2 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
                    Contact
                 </h2>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-muted-foreground">Full name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Your Name" 
                                    {...field} 
                                    className="bg-transparent border-0 border-b-2 border-muted-foreground/50 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors"
                                />
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
                            <FormLabel className="text-muted-foreground">Email address</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="your.email@example.com" 
                                    {...field} 
                                    className="bg-transparent border-0 border-b-2 border-muted-foreground/50 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-muted-foreground">Messages</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Your message..." 
                                    {...field} 
                                    className="bg-transparent border-0 border-b-2 border-muted-foreground/50 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors min-h-[60px]"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Right Column: Contact Info Card */}
            <div className="flex items-center">
                <Card className="w-full bg-card p-8 rounded-2xl shadow-lg">
                    <CardContent className="p-0 space-y-8">
                        <div className="bg-secondary p-6 rounded-xl">
                            <h3 className="text-xl font-headline font-bold">Get in touch with us!</h3>
                            <p className="text-muted-foreground">Let's talk!</p>
                        </div>
                        <div className="space-y-6">
                            <ContactInfoItem icon={<Mail size={20}/>} href="mailto:hello@scholarai.app" text="hello@scholarai.app" />
                            <ContactInfoItem icon={<Phone size={20}/>} href="tel:+917019328650" text="+91 7019328650" />
                            <ContactInfoItem icon={<Linkedin size={20}/>} href="https://www.linkedin.com/in/arshad-momin-a3139b21b" text="Arshad Momin" />
                            <ContactInfoItem icon={<Instagram size={20}/>} href="https://www.instagram.com/zaidwontdo/" text="zaidwontdo" />
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </section>
  );
}
