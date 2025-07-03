import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, TestTube2, BookOpen } from 'lucide-react';

const useCases = [
  {
    icon: <GraduationCap className="h-10 w-10 text-accent mb-4" />,
    title: 'For the Student',
    description: "Cramming for a history final on the 'Roman Empire'? Instead of sifting through dense textbooks, you enter the topic into ScholarAI. Instantly, you get concise notes, key-date flashcards, and a practice quiz, turning hours of work into a focused study session."
  },
  {
    icon: <Briefcase className="h-10 w-10 text-accent mb-4" />,
    title: 'For the Professional',
    description: "A marketing manager needs to quickly understand 'Quantum Computing' for a new client. ScholarAI provides a high-level overview, essential terminology on flashcards, and a quiz to ensure they grasp the core concepts before the big meeting."
  },
  {
    icon: <TestTube2 className="h-10 w-10 text-accent mb-4" />,
    title: 'For the Researcher',
    description: "Facing a mountain of research papers on 'CRISPR Gene Editing'? Use ScholarAI to summarize key articles, identify common themes and terminology, and generate quizzes to ensure you're retaining the critical details from each source."
  },
  {
    icon: <BookOpen className="h-10 w-10 text-accent mb-4" />,
    title: 'For the Lifelong Learner',
    description: "Simply curious about 'The Philosophy of Stoicism'? Spark your intellectual journey with an AI-generated introduction. Get the foundational concepts, key figures, and essential questions to ponder, all without the commitment of a full book."
  }
]

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
            Whether you're studying for an exam, skilling up for work, or just satisfying your curiosity, ScholarAI is your personal learning assistant.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {useCases.map((useCase) => (
            <Card key={useCase.title}>
              <CardHeader>
                {useCase.icon}
                <CardTitle className="font-headline">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {useCase.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
