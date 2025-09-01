
'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "Wisdomis Fun has completely changed how I prepare for exams. The AI-generated notes are incredibly detailed and save me hours of work. I've never felt more prepared!",
    name: 'Sarah L.',
    handle: 'University Student',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote: 'As a developer, I need to learn new technologies fast. This tool is my secret weapon. I can get up to speed on any topic in a fraction of the time. Absolutely brilliant.',
    name: 'David C.',
    handle: 'Software Engineer',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    quote: "The flashcards and quizzes are a game-changer for retention. I used to forget things easily, but the active recall practice has made a huge difference in my grades.",
    name: 'Emily R.',
    handle: 'High School Junior',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    quote: "I was overwhelmed by my syllabus, but the AI Roadmap feature created a clear, day-by-day plan that made it all manageable. It's like having a personal academic advisor.",
    name: 'Michael B.',
    handle: 'Post-Grad Student',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    quote: "The best part is the SageMaker assistant. Whenever I'm stuck on a concept, I can just ask for a simple explanation. It's like having a 24/7 tutor on demand.",
    name: 'Jessica P.',
    handle: 'Medical Student',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    quote: 'This is the study tool I wish I had years ago. It takes the most tedious parts of learning—summarizing and creating study aids—and automates them beautifully. Highly recommended!',
    name: 'Chris T.',
    handle: 'Lifelong Learner',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

const TestimonialCard = ({
  quote,
  name,
  handle,
  avatar,
}: {
  quote: string;
  name: string;
  handle: string;
  avatar: string;
}) => (
  <Card className="h-full w-[350px] flex-shrink-0 snap-center rounded-2xl border-2 border-primary/10 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
    <CardContent className="flex h-full flex-col p-0">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <blockquote className="my-4 flex-1 text-lg leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{handle}</p>
        </div>
      </footer>
    </CardContent>
  </Card>
);

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Loved by Learners Worldwide
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            See how students and professionals are transforming their study habits and acing their goals with Wisdomis Fun.
          </p>
        </div>
      </div>
      <div
        className="group relative mt-16 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
      >
        <div className="flex animate-marquee-x items-stretch gap-8 pr-8 group-hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
