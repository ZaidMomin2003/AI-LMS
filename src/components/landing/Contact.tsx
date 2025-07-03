import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="bg-secondary py-20 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Get in Touch
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Have feedback or a question we didn't answer? We'd love to hear from you.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <a href="mailto:contact@scholarai.app">
              <Mail className="mr-2" />
              contact@scholarai.app
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
