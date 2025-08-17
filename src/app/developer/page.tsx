
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Eye, BrainCircuit, Bot, Map } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type IconComponentType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const featureCards: {
  icon: IconComponentType;
  title: string;
  description: string;
}[] = [
  {
    icon: BrainCircuit,
    title: 'Instant Study Aids',
    description: "AI-powered generation of notes, flashcards, and quizzes to accelerate learning.",
  },
  {
    icon: Bot,
    title: 'SageMaker AI Assistant',
    description: "A personal AI tutor available 24/7 to answer questions and explain complex topics.",
  },
  {
    icon: Map,
    title: 'Personalized Roadmaps',
    description: "Custom, day-by-day study plans to guide students through their syllabus effectively.",
  },
];


export default function DeveloperPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    
                    {/* --- Hero Section --- */}
                    <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-20 text-center md:text-left">
                        <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                            <Image
                                src="/zaid.jpg"
                                alt="Zaid (Arshad)"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full border-4 border-primary shadow-lg"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-headline font-bold">Zaid (Arshad)</h1>
                            <p className="text-xl text-primary font-semibold mt-1">Creator of Wisdomis Fun</p>
                            <p className="text-muted-foreground mt-4 max-w-lg">
                                B.Tech in Computer Science & Engineering from GITAM University, based in Bijapur, Karnataka. Driven by a passion for leveraging technology to help students overcome their learning challenges and achieve academic excellence.
                            </p>
                        </div>
                    </section>
                    
                    {/* --- Mission & Vision --- */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <Card className="bg-card/50">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Target className="w-8 h-8 text-primary" />
                                <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    To democratize education by providing powerful, AI-driven study tools that are accessible and affordable for every learner, everywhere. We aim to make studying smarter, not harder.
                                </p>
                            </CardContent>
                        </Card>
                         <Card className="bg-card/50">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Eye className="w-8 h-8 text-primary" />
                                <CardTitle className="font-headline text-2xl">Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    To create a world where anyone can master any subject they choose. We envision a future where personalized learning is not a luxury, but a standard for academic and personal growth.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* --- Features Section --- */}
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                                Built with Passion
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                Key features developed with the student's journey in mind.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featureCards.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <Card key={feature.title} className="text-center p-6">
                                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                                    </Card>
                                )
                            })}
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    );
}
