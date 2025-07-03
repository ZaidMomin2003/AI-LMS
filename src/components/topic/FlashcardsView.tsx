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

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

const colorPalettes = [
  { bg: 'bg-emerald-500', text: 'text-emerald-50', shadow: 'shadow-emerald-500/50' },
  { bg: 'bg-sky-500', text: 'text-sky-50', shadow: 'shadow-sky-500/50' },
  { bg: 'bg-amber-500', text: 'text-amber-50', shadow: 'shadow-amber-500/50' },
  { bg: 'bg-rose-500', text: 'text-rose-50', shadow: 'shadow-rose-500/50' },
  { bg: 'bg-fuchsia-600', text: 'text-fuchsia-50', shadow: 'shadow-fuchsia-600/50' },
  { bg: 'bg-indigo-500', text: 'text-indigo-50', shadow: 'shadow-indigo-500/50' },
];

function FlippableCard({ card, index }: { card: Flashcard; index: number }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  // Reset flip state when card changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const palette = colorPalettes[index % colorPalettes.length];

  return (
    <div className="w-full h-full perspective-1000">
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d',
          { 'rotate-y-180': isFlipped }
        )}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="h-full flex items-center justify-center" onClick={() => setIsFlipped(true)}>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-headline">{card.term}</p>
            </CardContent>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card 
            className={cn(
              "h-full flex items-center justify-center shadow-lg",
              palette.bg,
              palette.text,
              palette.shadow
            )}
            onClick={() => setIsFlipped(false)}
          >
            <CardContent className="p-6 text-center">
              <p className="text-lg">{card.definition}</p>
            </CardContent>
          </Card>
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
              <div className="p-1 h-[250px]">
                <FlippableCard card={card} index={index} />
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
