
'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "My AP Bio notes were a mess. One click and Wisdomis Fun organized everything into notes and flashcards. I actually understand cellular respiration now!",
    name: 'Maya R.',
    handle: 'High School Junior',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote: "I used to spend hours making my own Quizlets. This does it for me in seconds, and the quizzes are way better. My grades have actually improved.",
    name: 'Leo F.',
    handle: 'Sophomore',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    quote: "The roadmap feature planned my entire finals week. I knew exactly what to study each day and didn't have to stress about it. Total game-changer.",
    name: 'Jasmine K.',
    handle: 'AP Student',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    quote: "Honestly, the best part is just not having to read the super boring textbook chapters. The AI notes give me everything I need to know, but faster.",
    name: 'Kevin S.',
    handle: 'Grade 11',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    quote: "I'm not great at history dates, but the flashcards made it feel like a game. I finally memorized all the key events for my midterm.",
    name: 'Chloe T.',
    handle: 'History Buff',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    quote: "SageMaker is like having a super smart friend you can text at 2 AM when you're stuck on a math problem. It just explains things in a way that makes sense.",
    name: 'Ben A.',
    handle: 'Mathlete',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    quote: "This is the only study tool I've actually stuck with. It's so easy to use and it genuinely helps me feel less anxious about big tests.",
    name: 'Olivia M.',
    handle: 'Future Valedictorian',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    quote: "I uploaded a picture of a confusing physics problem from my homework and it gave me the answer AND the steps. I was shocked it actually worked.",
    name: 'Noah P.',
    handle: 'Physics Student',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    quote: "My English teacher was so impressed with my detailed analysis of 'The Great Gatsby.' Little does she know, AI helped me organize my thoughts!",
    name: 'Sophia W.',
    handle: 'Literature Lover',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    quote: "Being able to just paste my whole syllabus for the semester and get a study plan was incredible. I've never felt so organized.",
    name: 'Liam G.',
    handle: 'Grade 12',
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
  {
    quote: "The Pomodoro timer keeps me from getting distracted by my phone. Those 25-minute focus blocks are surprisingly effective.",
    name: 'Isabella C.',
    handle: 'Procrastinator turned Pro',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    quote: "I used to hate studying, but this makes it feel less like a chore. The instant results are so satisfying.",
    name: 'Mason H.',
    handle: 'Aspiring Scholar',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    quote: "My friends and I all use it now. We share the notes it generates and quiz each other with the flashcards. It's our group study secret weapon.",
    name: 'Ava D.',
    handle: 'Study Group Leader',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    quote: "The quizzes are my favorite part. They show me exactly what I don't know so I can go back and review before the test.",
    name: 'Elijah B.',
    handle: 'Test Ace',
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
  {
    quote: "I have so much more free time for sports and hanging out with friends because my study sessions are so much more efficient now. No more all-nighters!",
    name: 'Harper J.',
    handle: 'Student Athlete',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    quote: "From world history to chemistry formulas, this app handles everything I throw at it. It's the most versatile study tool I've ever used.",
    name: 'Logan V.',
    handle: 'High School Senior',
    avatar: 'https://i.pravatar.cc/150?img=16',
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
