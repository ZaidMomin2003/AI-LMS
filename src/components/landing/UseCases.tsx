
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
    <section id="use-cases" className="relative py-20 sm:py-32">
       <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                'linear-gradient(152.92deg, hsl(var(--primary)/.2) 4.54%, hsl(var(--primary)/.26) 34.2%, hsl(var(--primary)/.1) 77.55%)',
            }}
      ></div>
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-headline mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Adaptable to Any Learning Need
            </h3>
            <p className="text-muted-foreground mt-3">
              Whether you're studying for an exam, skilling up for work, or just satisfying your curiosity, Wisdomis Fun is your personal learning assistant.
            </p>
          </div>
        </div>
        <hr className="bg-foreground/10 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {useCases.map((item, idx) => {
              const IconComponent = item.icon;
              return (
               <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_hsl(var(--primary)/.15)_inset]"
              >
                <div className="text-primary w-fit transform-gpu rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_hsl(var(--primary)/.2)_inset] dark:[box-shadow:0_-20px_80px_-20px_hsl(var(--primary)/.05)_inset]">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h4 className="font-headline text-lg font-bold tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-muted-foreground">{item.description}</p>
              </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
