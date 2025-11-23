
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Eye, BrainCircuit, Bot, Map, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type IconComponentType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const philosophyCards: {
  icon: IconComponentType;
  title: string;
  description: string;
}[] = [
  {
    icon: Target,
    title: 'Our Mission',
    description: "To democratize education by providing powerful, AI-driven study tools that are accessible and affordable for every learner, everywhere.",
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: "To create a world where personalized learning is not a luxury, but a standard for academic and personal growth.",
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: "We are driven by student-centric design, a passion for innovation, and a commitment to making learning smarter, not harder.",
  },
];

const techStack = [
    { name: 'Next.js', logo: '/logos/nextjs.svg' },
    { name: 'React', logo: '/logos/react.svg' },
    { name: 'Firebase', logo: '/logos/firebase.svg' },
    { name: 'Genkit', logo: '/logos/genkit.svg' },
    { name: 'Tailwind CSS', logo: '/logos/tailwind.svg' },
    { name: 'TypeScript', logo: '/logos/typescript.svg' },
]


export default function DeveloperPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <section className="relative bg-secondary/30 py-20 md:py-32">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-12">
                            <div className="relative w-48 h-48 md:w-full md:h-auto md:aspect-square flex-shrink-0 mx-auto">
                                <Image
                                    src="/zaid.jpg"
                                    alt="Zaid (Arshad)"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full md:rounded-3xl border-4 border-primary shadow-lg"
                                />
                            </div>
                            <div className="md:col-span-2 text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-headline font-bold">Zaid (Arshad)</h1>
                                <p className="text-xl text-primary font-semibold mt-1">Creator of Wisdom</p>
                                <p className="text-muted-foreground mt-4 max-w-xl mx-auto md:mx-0">
                                    B.Tech in Computer Science & Engineering, driven by a passion for leveraging technology to help students overcome their learning challenges and achieve academic excellence.
                                </p>
                                <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                                    <Button asChild variant="ghost" size="icon"><Link href="https://twitter.com" target="_blank"><Twitter className="h-5 w-5"/></Link></Button>
                                    <Button asChild variant="ghost" size="icon"><Link href="https://linkedin.com" target="_blank"><Linkedin className="h-5 w-5"/></Link></Button>
                                    <Button asChild variant="ghost" size="icon"><Link href="https://github.com" target="_blank"><Github className="h-5 w-5"/></Link></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* --- Philosophy Section --- */}
                <section className="py-20 sm:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                                My Philosophy
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                The core beliefs that drive the development of Wisdom.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {philosophyCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <Card key={card.title} className="bg-card/50 text-center p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                        <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold font-headline">{card.title}</h3>
                                        <p className="text-muted-foreground mt-2">{card.description}</p>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>
                
                {/* --- Tech Stack --- */}
                 <section className="bg-secondary/30 py-20 sm:py-24">
                    <div className="container mx-auto px-4">
                         <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                                Technology Stack
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                Built with a modern, scalable, and powerful stack.
                            </p>
                        </div>
                        <div className="mx-auto grid max-w-4xl grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
                            {techStack.map((tech) => (
                                <div key={tech.name} className="flex flex-col items-center justify-center gap-2 text-center">
                                    <div className="relative w-16 h-16 grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100 hover:scale-110">
                                         <Image src={tech.logo} alt={tech.name} layout="fill" objectFit="contain" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">{tech.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                 {/* --- CTA Section --- */}
                <section className="py-20 sm:py-32">
                  <div className="container mx-auto px-4">
                    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl bg-primary p-10 text-center">
                      <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">
                          Have an Idea or Question?
                        </h2>
                        <p className="mt-4 max-w-md mx-auto text-base text-primary-foreground/90 sm:text-lg">
                          I'm always open to feedback, collaboration, or just a good chat about technology and education.
                        </p>
                         <Button asChild size="lg" className="mt-8 bg-card text-card-foreground hover:bg-card/90 shadow-lg">
                            <Link href="/#contact">
                                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
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
