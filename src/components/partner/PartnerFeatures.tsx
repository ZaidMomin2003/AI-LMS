
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, ShieldCheck, UserCog, BookCheck } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type IconComponentType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const features: {
  icon: IconComponentType;
  title: string;
  description: string;
}[] = [
  {
    icon: UserCog,
    title: 'Centralized Management',
    description: "Easily manage student accounts, assign access, and oversee usage from a single, intuitive admin dashboard."
  },
  {
    icon: BarChart2,
    title: 'Performance Analytics',
    description: "Gain insights into student engagement and topic popularity to identify areas where students may need additional support."
  },
  {
    icon: BookCheck,
    title: 'Curriculum Alignment',
    description: "We can work with you to align our AI's content generation with your specific curriculum standards and learning objectives."
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure',
    description: "Our platform is built with student privacy and data security as a top priority, ensuring a safe learning environment."
  }
]

export function PartnerFeatures() {
  return (
    <section id="partner-features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Built for Educational Institutions
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We provide the tools and support you need to successfully integrate AI-powered learning into your school.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none md:grid-cols-2">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.title} className="group rounded-xl p-px transition-all duration-300 bg-gradient-to-br from-border/50 to-background hover:from-primary hover:to-accent">
                <Card className="h-full rounded-[11px] bg-background/95">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                       <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
