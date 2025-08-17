import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, TestTube2, BookOpen, type LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Define a more specific type for the icon
type IconComponentType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const useCases: {
  icon: IconComponentType;
  title: string;
  description: string;
}[] = [
  {
    icon: GraduationCap,
    title: 'For the Student',
    description: "Cramming for a final on the 'Roman Empire'? Instantly get concise notes, key-date flashcards, and a practice quiz, turning hours of work into a focused study session."
  },
  {
    icon: Briefcase,
    title: 'For the Professional',
    description: "Need to quickly understand 'Quantum Computing' for a new client? Get a high-level overview and essential terminology to grasp core concepts before the big meeting."
  },
  {
    icon: TestTube2,
    title: 'For the Researcher',
    description: "Facing a mountain of papers on 'CRISPR'? Summarize articles, identify themes, and generate quizzes to retain critical details from each source."
  },
  {
    icon: BookOpen,
    title: 'For the Lifelong Learner',
    description: "Curious about 'The Philosophy of Stoicism'? Spark your intellectual journey with an AI-generated introduction. Get foundational concepts and key figures without committing to a full book."
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
            Whether you're studying for an exam, skilling up for work, or just satisfying your curiosity, Wisdomis Fun is your personal learning assistant.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none md:grid-cols-2">
          {useCases.map((useCase) => {
            const IconComponent = useCase.icon;
            return (
              <div key={useCase.title} className="group rounded-xl p-px transition-all duration-300 bg-gradient-to-br from-border/50 to-background hover:from-primary hover:to-accent">
                <Card className="h-full rounded-[11px] bg-background/95">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                       <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {useCase.description}
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
