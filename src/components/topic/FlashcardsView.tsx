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
            'overflow-hidden rounded-3xl',
            'bg-zinc-900/40 backdrop-blur-2xl',
            'border border-white/5',
            'shadow-2xl shadow-black/50',
            'transition-all duration-700',
            'flex flex-col'
          )}
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full" />

          <div className="flex-1 flex items-center justify-center p-8 relative z-10">
            <h3 className="text-3xl md:text-4xl text-center leading-tight font-black font-headline tracking-tighter text-white">
              {card.term}
            </h3>
          </div>
          <div className="relative z-10 border-t border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <BookText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Neural Term</span>
              </div>
              <span className="text-[10px] font-bold text-primary animate-pulse">Touch to decrypt</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-3xl p-8',
            'bg-gradient-to-br from-primary via-primary/90 to-blue-600',
            'border border-white/20',
            'shadow-2xl shadow-primary/20',
            'flex flex-col relative overflow-hidden',
          )}
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="flex-1 flex items-center justify-center relative z-10">
            <p className="text-xl md:text-2xl text-center text-white font-medium leading-relaxed tracking-tight">
              {card.definition}
            </p>
          </div>
          <div className="relative z-10 mt-auto border-t border-white/10 pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/20">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Synthesized Definition</span>
              </div>
              <span className="text-[10px] font-bold text-white/50">Return to source</span>
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
