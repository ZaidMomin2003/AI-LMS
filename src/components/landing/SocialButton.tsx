
'use client';

/**
 * @author: @dorianbaffier
 * @description: Social Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Instagram, Linkedin, Share, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/fallen_zaid/' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/arshad-momin-a3139b21b/' },
  { icon: User, label: 'About', href: '/developer' },
];

export default function SocialButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleButtonClick = (index: number) => {
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 300);
  };

  const MotionLink = motion(NextLink);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        animate={{
          opacity: isVisible ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
      >
        <Button
          className={cn(
            'relative min-w-40',
            'bg-background',
            'hover:bg-muted',
            'text-foreground',
            'border border-border',
            'transition-colors duration-200',
            className,
          )}
          {...props}
        >
          <span className="flex items-center gap-2">
            Made with 💓 by Arshad (Zaid)
          </span>
        </Button>
      </motion.div>

      <motion.div
        animate={{
          width: isVisible ? 'auto' : 0,
        }}
        className="absolute top-0 left-0 flex h-10 overflow-hidden"
        transition={{
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {socialLinks.map((button, i) => (
          <MotionLink
            href={button.href}
            passHref
            key={`share-${button.label}`}
            target={button.href.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : -20,
            }}
            aria-label={button.label}
            className={cn(
                'h-10 w-10',
                'flex items-center justify-center',
                'bg-foreground',
                'text-background',
                i === 0 && 'rounded-l-md',
                i === socialLinks.length - 1 && 'rounded-r-md',
                'border-background/10 border-r last:border-r-0',
                'hover:bg-primary',
                'outline-none relative overflow-hidden transition-colors duration-200',
            )}
            onClick={() => handleButtonClick(i)}
            transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
                delay: isVisible ? i * 0.05 : 0,
            }}
          >
            <motion.div
              animate={{
                scale: activeIndex === i ? 0.85 : 1,
              }}
              className="relative z-10"
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            >
              <button.icon className="h-4 w-4" />
            </motion.div>
            <motion.div
              animate={{
                opacity: activeIndex === i ? 0.2 : 0,
              }}
              className="absolute inset-0 bg-background"
              initial={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            />
          </MotionLink>
        ))}
      </motion.div>
    </div>
  );
}
