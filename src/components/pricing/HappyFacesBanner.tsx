
'use client';

import { useAnimate, motion } from 'framer-motion';
import React, { useRef } from 'react';
import { Smile } from 'lucide-react';
import Image from 'next/image';

const images = [
  'https://picsum.photos/seed/student1/400/600',
  'https://picsum.photos/seed/student2/400/600',
  'https://picsum.photos/seed/student3/400/600',
  'https://picsum.photos/seed/student4/400/600',
  'https://picsum.photos/seed/student5/400/600',
  'https://picsum.photos/seed/student6/400/600',
  'https://picsum.photos/seed/student7/400/600',
  'https://picsum.photos/seed/student8/400/600',
  'https://picsum.photos/seed/student9/400/600',
  'https://picsum.photos/seed/student10/400/600',
  'https://picsum.photos/seed/student11/400/600',
  'https://picsum.photos/seed/student12/400/600',
  'https://picsum.photos/seed/student13/400/600',
  'https://picsum.photos/seed/student14/400/600',
  'https://picsum.photos/seed/student15/400/600',
  'https://picsum.photos/seed/student16/400/600',
];

const MouseImageTrail = ({
  children,
  renderImageBuffer,
  rotationRange,
}: {
  children: React.ReactNode;
  renderImageBuffer: number;
  rotationRange: number;
}) => {
  const [scope, animate] = useAnimate();

  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;

    const distance = calculateDistance(
      clientX,
      clientY,
      lastRenderPosition.current.x,
      lastRenderPosition.current.y
    );

    if (distance >= renderImageBuffer) {
      lastRenderPosition.current.x = clientX;
      lastRenderPosition.current.y = clientY;

      renderNextImage();
    }
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  const renderNextImage = () => {
    const imageIndex = imageRenderCount.current % images.length;
    const selector = `[data-mouse-move-index="${imageIndex}"]`;

    const el = document.querySelector(selector) as HTMLElement;
    if (!el) return;

    el.style.top = `${lastRenderPosition.current.y}px`;
    el.style.left = `${lastRenderPosition.current.x}px`;
    el.style.zIndex = imageRenderCount.current.toString();

    const rotation = Math.random() * rotationRange;

    animate(
      selector,
      {
        opacity: [0, 1],
        transform: [
          `translate(-50%, -25%) scale(0.5) ${
            imageIndex % 2 ? `rotate(${rotation}deg)` : `rotate(-${rotation}deg)`
          }`,
          `translate(-50%, -50%) scale(1) ${
            imageIndex % 2 ? `rotate(-${rotation}deg)` : `rotate(${rotation}deg)`
          }`,
        ],
      },
      { type: 'spring', damping: 15, stiffness: 200 }
    );

    animate(
      selector,
      {
        opacity: [1, 0],
      },
      { ease: 'linear', duration: 0.5, delay: 1 }
    );

    imageRenderCount.current = imageRenderCount.current + 1;
  };

  return (
    <div
      ref={scope}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {children}

      {images.map((img, index) => (
        <Image
          className="pointer-events-none absolute left-0 top-0 h-36 w-auto rounded-xl border-2 border-border bg-background object-cover opacity-0"
          src={img}
          alt={`Mouse move image ${index}`}
          key={index}
          data-mouse-move-index={index}
          width={200}
          height={300}
          data-ai-hint="student smiling"
        />
      ))}
    </div>
  );
};


export const HappyFacesBanner = () => {
  return (
    <MouseImageTrail
      renderImageBuffer={50}
      rotationRange={25}
    >
      <section className="grid h-48 w-full place-content-center bg-card rounded-2xl border border-dashed border-primary/50">
        <p className="flex items-center gap-4 text-5xl font-bold uppercase text-foreground">
          <Smile className="w-12 h-12 text-primary" />
          <span>Join hundreds of happy learners</span>
        </p>
      </section>
    </MouseImageTrail>
  );
};

