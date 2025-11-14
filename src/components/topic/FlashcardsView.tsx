'use client';

import * as React from 'react';
import type { Flashcard } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { BookText, Brain } from 'lucide-react';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

function FlippableCard({ card }: { card: Flashcard; }) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Reset flip state when card changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  return (
    <div
      className="group relative h-full w-full [perspective:2000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-2xl',
            'bg-gradient-to-br from-white via-slate-50 to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800',
            'border border-slate-200 dark:border-zinc-800/50',
            'shadow-lg dark:shadow-xl',
            'transition-all duration-700',
            'flex flex-col'
          )}
        >
          <div className="from-primary/5 dark:from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />
          <div className="flex-1 flex items-center justify-center p-6">
             <h3 className="text-3xl text-center leading-snug font-headline tracking-tight text-zinc-900 dark:text-white">
                {card.term}
             </h3>
          </div>
           <div className="relative z-10 border-t border-slate-200 dark:border-zinc-800 p-4">
               <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <BookText className="w-3 h-3"/>
                        <span>Term</span>
                    </div>
                    <span>Click to flip</span>
               </div>
           </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-2xl p-5',
            'bg-gradient-to-br from-primary/95 via-primary to-primary/90',
            'border border-primary/50',
            'shadow-lg shadow-primary/30',
            'flex flex-col',
          )}
        >
            <div className="flex-1 flex items-center justify-center p-6">
                <p className="text-lg text-center text-primary-foreground">
                    {card.definition}
                </p>
            </div>
            <div className="relative z-10 mt-auto border-t border-primary-foreground/30 pt-4">
                <div className="flex items-center justify-between gap-2 text-xs text-primary-foreground/80">
                    <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3"/>
                        <span>Definition</span>
                    </div>
                    <span>Click to flip back</span>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}


export function FlashcardsView({ flashcards }: FlashcardsViewProps) {
  if (!flashcards || flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No flashcards available for this topic.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full max-w-lg"
      >
        <CarouselContent>
          {flashcards.map((card, index) => (
            <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
              <div className="p-1 h-[360px]">
                <FlippableCard card={card} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
       <p className="text-sm text-muted-foreground">Click card to flip. Use arrows to navigate.</p>
    </div>
  );
}
