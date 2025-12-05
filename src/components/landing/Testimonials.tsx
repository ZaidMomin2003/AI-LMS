
'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const originalTestimonials = [
  {
    quote: "My AP Bio notes were a mess. One click and wisdom organized everything into notes and flashcards. I actually understand cellular respiration now!",
    name: 'Maya R.',
    handle: 'High School Junior',
  },
  {
    quote: "I used to spend hours making my own Quizlets. This does it for me in seconds, and the quizzes are way better. My grades have actually improved.",
    name: 'Leo F.',
    handle: 'Sophomore',
  },
  {
    quote: "The roadmap feature planned my entire finals week. I knew exactly what to study each day and didn't have to stress about it. Total game-changer.",
    name: 'Jasmine K.',
    handle: 'AP Student',
  },
  {
    quote: "Honestly, the best part is just not having to read the super boring textbook chapters. The AI notes give me everything I need to know, but faster.",
    name: 'Kevin S.',
    handle: 'Grade 11',
  },
  {
    quote: "I'm not great at history dates, but the flashcards made it feel like a game. I finally memorized all the key events for my midterm.",
    name: 'Chloe T.',
    handle: 'History Buff',
  },
  {
    quote: "WisdomGPT is like having a super smart friend you can text at 2 AM when you're stuck on a math problem. It just explains things in a way that makes sense.",
    name: 'Ben A.',
    handle: 'Mathlete',
  },
  {
    quote: "This is the only study tool I've actually stuck with. It's so easy to use and it genuinely helps me feel less anxious about big tests.",
    name: 'Olivia M.',
    handle: 'Future Valedictorian',
  },
  {
    quote: "I uploaded a picture of a confusing physics problem from my homework and it gave me the answer AND the steps. I was shocked it actually worked.",
    name: 'Noah P.',
    handle: 'Physics Student',
  },
  {
    quote: "My English teacher was so impressed with my detailed analysis of 'The Great Gatsby.' Little does she know, AI helped me organize my thoughts!",
    name: 'Sophia W.',
    handle: 'Literature Lover',
  },
  {
    quote: "Being able to just paste my whole syllabus for the semester and get a study plan was incredible. I've never felt so organized.",
    name: 'Liam G.',
    handle: 'Grade 12',
  },
  {
    quote: "The Pomodoro timer keeps me from getting distracted by my phone. Those 25-minute focus blocks are surprisingly effective.",
    name: 'Isabella C.',
    handle: 'Procrastinator turned Pro',
  },
  {
    quote: "I used to hate studying, but this makes it feel less like a chore. The instant results are so satisfying.",
    name: 'Mason H.',
    handle: 'Aspiring Scholar',
  },
  {
    quote: "My friends and I all use it now. We share the notes it generates and quiz each other with the flashcards. It's our group study secret weapon.",
    name: 'Ava D.',
    handle: 'Study Group Leader',
  },
  {
    quote: "The quizzes are my favorite part. They show me exactly what I don't know so I can go back and review before the test.",
    name: 'Elijah B.',
    handle: 'Test Ace',
  },
  {
    quote: "I have so much more free time for sports and hanging out with friends because my study sessions are so much more efficient now. No more all-nighters!",
    name: 'Harper J.',
    handle: 'Student Athlete',
  },
  {
    quote: "From world history to chemistry formulas, this app handles everything I throw at it. It's the most versatile study tool I've ever used.",
    name: 'Logan V.',
    handle: 'High School Senior',
  },
];

// Adapt the original data to the new component's expected format
const adaptedTestimonials = originalTestimonials.map(t => ({
    text: t.quote,
    name: t.name,
    username: `@${t.name.split(' ')[0].toLowerCase()}`,
    role: t.handle,
    img: `https://picsum.photos/seed/${t.name.split(' ')[0].toLowerCase()}/100/100`
}));


interface TestimonialProps {
  testimonials?: {
    text: string;
    name: string;
    username: string;
    role?: string;
  }[];
  title?: string;
  subtitle?: string;
  autoplaySpeed?: number;
  className?: string;
}

export function Testimonials({
  testimonials = adaptedTestimonials,
  title = 'Loved by Learners Worldwide',
  subtitle = 'See how students and professionals are transforming their study habits and acing their goals with wisdom.',
  autoplaySpeed = 3000,
  className,
}: TestimonialProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

   useEffect(() => {
     if (!emblaApi) return;

     const autoplay = setInterval(() => {
       emblaApi.scrollNext();
     }, autoplaySpeed);

     return () => {
       clearInterval(autoplay);
     };
   }, [emblaApi, autoplaySpeed]);

    const allTestimonials = [...testimonials, ...testimonials];

    return (
     <section
       className={cn('relative overflow-hidden py-16 md:py-24', className)}
     >
       <div className="absolute inset-0 -z-10">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
         <div className="bg-primary/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
         <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
       </div>

       <div className="container mx-auto px-4 md:px-6">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           viewport={{ once: true }}
           className="relative mb-12 text-center md:mb-16"
         >
           <h1 className="from-foreground to-foreground/40 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent md:text-5xl lg:text-6xl font-headline">
             {title}
           </h1>

           <motion.p
             className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg"
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             viewport={{ once: true }}
           >
             {subtitle}
           </motion.p>
         </motion.div>

         {/* Testimonials carousel */}
         <div className="overflow-hidden" ref={emblaRef}>
           <div className="flex">
             {allTestimonials.map((testimonial, index) => (
               <div
                 key={`${testimonial.name}-${index}`}
                 className="flex justify-center px-4 min-w-[380px]"
               >
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.5, delay: index * 0.1 }}
                   viewport={{ once: true }}
                   className="border-border from-secondary/20 to-card relative h-full w-full rounded-2xl border bg-gradient-to-b p-6 shadow-md backdrop-blur-sm"
                 >
                   {/* Enhanced decorative gradients */}
                   <div className="from-primary/15 to-card absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b blur-md" />
                   <div className="from-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t to-transparent opacity-70 blur-xl" />

                   <motion.div
                     initial={{ opacity: 0, y: -5 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                     viewport={{ once: true }}
                     className="text-primary mb-4"
                   >
                     <div className="relative">
                       <Quote className="h-10 w-10 -rotate-180" />
                     </div>
                   </motion.div>

                   <motion.p
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                     viewport={{ once: true }}
                     className="text-foreground/90 relative mb-6 text-base leading-relaxed"
                   >
                     <span className="relative">{testimonial.text}</span>
                   </motion.p>

                   {/* Enhanced user info with animation */}
                   <motion.div
                     initial={{ opacity: 0, y: 5 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                     viewport={{ once: true }}
                     className="border-border/40 mt-auto flex items-center gap-3 border-t pt-2"
                   >
                     <Avatar className="border-border ring-primary/10 ring-offset-background h-10 w-10 border ring-2 ring-offset-1">
                       <AvatarFallback>
                         {testimonial.name.charAt(0)}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col">
                       <h4 className="text-foreground font-medium whitespace-nowrap">
                         {testimonial.name}
                       </h4>
                       <div className="flex items-center gap-2">
                         <p className="text-primary/80 text-sm whitespace-nowrap">
                           {testimonial.username}
                         </p>
                         {testimonial.role && (
                           <>
                             <span className="text-muted-foreground flex-shrink-0">
                               •
                             </span>
                             <p className="text-muted-foreground text-sm whitespace-nowrap">
                               {testimonial.role}
                             </p>
                           </>
                         )}
                       </div>
                     </div>
                   </motion.div>
                 </motion.div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 }

export const TestimonialColumn = ({
  testimonials,
  duration = 60,
  className
}: {
  testimonials: typeof adaptedTestimonials;
  duration?: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
        <motion.div
            animate={{ translateY: "-50%" }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
            }}
            className="flex flex-col gap-4 pb-4"
        >
            {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-full shrink-0 rounded-lg border bg-secondary p-6 shadow-sm">
                    <Quote className="h-8 w-8 text-primary/50 mb-4" />
                    <p className="mb-6 leading-relaxed text-muted-foreground">{t.text}</p>
                    <div className="flex items-center gap-4">
                         <Avatar>
                            <AvatarImage src={t.img} alt={t.name} />
                            <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-sm text-muted-foreground">{t.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
  );
};
