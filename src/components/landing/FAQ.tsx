
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "What is Wisdomis Fun?",
    answer: "Wisdomis Fun is an AI-powered learning platform designed for schools and institutions. It automatically generates comprehensive study notes, interactive flashcards, and quizzes on any topic to enhance the learning experience.",
  },
  {
    question: "How can my school get access?",
    answer: "Access to Wisdomis Fun is provided through institutional partnerships. Your school or university can sign up for a bulk license plan, and they will receive an invite code to distribute to students.",
  },
  {
    question: "I have an invite code. What do I do?",
    answer: "Great! Just head to our sign-up page, enter your invite code along with your details, and you'll get instant full access to the platform.",
  },
  {
    question: "What kind of topics can I generate materials for?",
    answer: "Virtually any topic you can imagine! From historical events and scientific theories to literary analysis and technical subjects, our AI is equipped to handle a vast range of subjects aligned with your curriculum.",
  },
   {
    question: "How accurate is the generated content?",
    answer: "Our AI is built on advanced language models and strives for accuracy. However, we always recommend using the generated materials as a study aid and cross-referencing with primary sources for critical academic work.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-32 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
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
                  className="rounded-lg border bg-card/50 shadow-sm transition-shadow hover:shadow-md hover:shadow-primary/20 backdrop-blur-sm"
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
