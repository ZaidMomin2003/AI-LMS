
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "How does the pricing work for schools?",
    answer: "We offer custom bulk licensing plans based on the number of students and the level of integration required. Contact us through the form above for a personalized quote.",
  },
  {
    question: "Is the platform difficult for students and teachers to learn?",
    answer: "Not at all! Wisdomis Fun is designed with a user-friendly interface that is intuitive for both students and educators. We also provide comprehensive onboarding materials to ensure a smooth start.",
  },
  {
    question: "Can we restrict the AI to specific subjects or topics?",
    answer: "Yes, our institutional plans offer administrative controls that can be configured to align with your curriculum, including subject restrictions and content filtering.",
  },
   {
    question: "How do you ensure student data privacy?",
    answer: "We are committed to protecting student privacy. All data is securely stored, and we adhere to strict data protection policies. We do not sell or share student data with third parties.",
  },
];

export function PartnerFAQ() {
  return (
    <section id="partner-faq" className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Common questions from school administrators and educators.
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
