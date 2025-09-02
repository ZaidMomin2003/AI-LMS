
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Lightbulb, Presentation, Rocket, Users } from 'lucide-react';

const workflowSteps = [
    {
        icon: Lightbulb,
        title: "1. Initial Inquiry",
        description: "Reach out via our form with your institution's details. We'll schedule a brief introductory call to understand your needs.",
    },
    {
        icon: Presentation,
        title: "2. Custom Demo",
        description: "We'll provide a personalized demo for your team, showcasing how Wisdomis Fun can align with your curriculum and goals.",
    },
    {
        icon: Users,
        title: "3. Onboarding",
        description: "Once we agree on a plan, we'll handle the technical setup and provide training materials for your staff and students.",
    },
    {
        icon: Rocket,
        title: "4. Launch & Support",
        description: "We'll launch the platform for your institution and provide ongoing support to ensure a smooth and successful integration.",
    }
];

export function PartnerWorkflow() {
    return (
        <section id="workflow" className="py-20 sm:py-32 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        A Simple Path to Partnership
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Our streamlined process makes it easy to bring the power of AI to your institution.
                    </p>
                </div>

                <div className="relative mt-16">
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-transparent">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,hsl(var(--border)),hsl(var(--border))_4px,transparent_4px,transparent_8px)]"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                        {workflowSteps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.title} className="flex flex-col items-center text-center lg:items-start lg:text-left relative">
                                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold font-headline">{step.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
