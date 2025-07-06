import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "What is ScholarAI?",
    answer: "ScholarAI is an AI-powered learning platform designed to accelerate your study process. It automatically generates comprehensive study notes, interactive flashcards, and quizzes on any topic you provide.",
  },
  {
    question: "Who is ScholarAI for?",
    answer: "It's for anyone who wants to learn more effectively. This includes students, professionals brushing up on new skills, lifelong learners, and anyone curious about a new subject.",
  },
  {
    question: "Is ScholarAI free to use?",
    answer: "Yes, we offer a free plan for you to try our services before committing to a paid subscription. The free plan allows you to generate materials for one topic.",
  },
  {
    question: "What kind of topics can I generate materials for?",
    answer: "Virtually any topic you can imagine! From historical events and scientific theories to literary analysis and technical subjects, our AI is equipped to handle a vast range of subjects.",
  },
   {
    question: "How accurate is the generated content?",
    answer: "Our AI is built on advanced language models and strives for accuracy. However, we always recommend using the generated materials as a study aid and cross-referencing with primary sources for critical academic work.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Can't find the answer you're looking for? Reach out to us through our contact section.
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                >
                  <AccordionTrigger className="p-6 text-left hover:no-underline">
                    <span className="flex-1 font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  );
}
