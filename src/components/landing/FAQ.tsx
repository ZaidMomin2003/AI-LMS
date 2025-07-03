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
    answer: "Yes, we offer a generous free plan that allows you to generate study materials. For heavy users or advanced features, we will offer premium plans in the future.",
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
    <section id="faq" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl lg:text-center animate-in fade-in slide-in-from-bottom-10 duration-500">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-500 delay-200">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
