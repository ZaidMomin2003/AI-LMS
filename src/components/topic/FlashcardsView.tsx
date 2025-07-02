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
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

function FlippableCard({ card }: { card: Flashcard }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  // Reset flip state when card changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [card]);

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
          <Card className="h-full flex items-center justify-center" onClick={() => setIsFlipped(false)}>
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
