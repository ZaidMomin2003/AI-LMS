
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Building, Users, BarChart, BookOpen } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Bulk Student Licenses',
    description: 'Provide access to all your students with simple, manageable licensing.',
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: 'Usage Analytics',
    description: 'Gain insights into student engagement and popular subjects at an aggregate level.',
  },
  {
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    title: 'Curriculum-Aligned Content',
    description: 'Work with us to align AI-generated content with your specific curriculum needs.',
  },
];

const pricingTiers = [
  {
    name: 'Classroom',
    students: '50-100 Students',
    price: '15% Discount',
    description: 'Perfect for individual classes or departments.',
  },
  {
    name: 'Department',
    students: '101-500 Students',
    price: '25% Discount',
    description: 'Equip an entire academic department with powerful AI tools.',
  },
  {
    name: 'Campus-Wide',
    students: '500+ Students',
    price: 'Custom Quote',
    description: 'Full access for your entire institution at the best possible value.',
  },
];

export default function CollabPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-secondary/50 py-20 md:py-32">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto w-fit mb-6 bg-primary/10 text-primary p-4 rounded-full">
                <Building className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
              Empower Your Institution with Wisdom
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Partner with us to bring the next generation of AI-powered study tools to your students and faculty. Enhance learning outcomes and prepare students for a digital future.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <a href="mailto:hello@wisdomis.fun?subject=School%20Partnership%20Inquiry">
                  Contact Sales <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Features for Schools --- */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Built for Education
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                A Smarter Way to Support Your Students
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our institutional packages are designed to integrate seamlessly into your educational ecosystem, providing value to both students and educators.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- Volume Discount Section --- */}
        <section className="bg-secondary/50 py-20 sm:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                    Volume-Based Discounts
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    We offer significant discounts for educational institutions. The more students you enroll, the more you save.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{tier.name}</CardTitle>
                    <p className="text-muted-foreground">{tier.students}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{tier.price}</p>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
                 <p className="text-lg text-muted-foreground">Ready to get a custom plan for your school?</p>
                <Button asChild size="lg" className="mt-4">
                     <a href="mailto:hello@wisdomis.fun?subject=School%20Partnership%20Inquiry">
                        Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
