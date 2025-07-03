import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase } from 'lucide-react';

export function UseCases() {
  return (
    <section id="use-cases" className="bg-secondary py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">For Everyone</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Adaptable to Any Learning Need
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Whether you're a student preparing for exams or a professional skilling up, ScholarAI has you covered.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-accent mb-4" />
              <CardTitle className="font-headline">For the Lifelong Learner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Imagine you're a student cramming for a history final on the 'Roman Empire'. Instead of sifting through dense textbooks, you enter the topic into ScholarAI. Instantly, you get concise notes, key-date flashcards, and a practice quiz, turning hours of work into a focused study session.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Briefcase className="h-10 w-10 text-accent mb-4" />
              <CardTitle className="font-headline">For the Curious Professional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A marketing manager needs to quickly understand 'Quantum Computing' for a new client. ScholarAI provides a high-level overview, essential terminology on flashcards, and a quiz to ensure they grasp the core concepts before the big meeting.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
