
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Lightbulb, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'AI-Powered Notes',
    description: 'Generate comprehensive notes on any topic instantly.',
  },
  {
    title: 'Interactive Quizzes',
    description: 'Test your knowledge and identify weak spots.',
  },
  {
    title: 'Personalized Roadmaps',
    description: 'Let AI create a custom study plan for you.',
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-10 w-10" />
        </div>
        <h1 className="text-6xl font-bold font-headline text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          You've ventured into uncharted territory.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you're looking for doesn't exist. But don't worry, your learning journey doesn't have to stop here.
        </p>
        
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/dashboard">Go Back to Dashboard</Link>
          </Button>
        </div>

        <div className="mt-16 text-left">
            <div className="flex items-center gap-2 justify-center mb-6">
                 <Lightbulb className="h-5 w-5 text-yellow-400" />
                 <h3 className="font-headline text-xl font-semibold">While you're here, why not explore?</h3>
            </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
