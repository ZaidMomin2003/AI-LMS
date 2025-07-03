'use client';

import { BookOpen, BrainCircuit, FlaskConical, Lightbulb, Beaker, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingIcon = ({ icon: Icon, className, style }: { icon: React.ElementType, className?: string, style?: React.CSSProperties }) => {
    return (
        <div className={cn("absolute opacity-20 -z-10", className)}>
            <Icon
                className="h-full w-full text-primary animate-float [filter:drop-shadow(0_0_10px_hsl(var(--primary)_/_0.8))]"
                style={style}
            />
        </div>
    )
}

export function FloatingIcons() {
    return (
        <div className="hidden md:block">
            <FloatingIcon icon={Lightbulb} className="w-16 h-16 top-[15%] left-[10%]" style={{ animationDelay: '0s', animationDuration: '8s' }} />
            <FloatingIcon icon={BrainCircuit} className="w-12 h-12 top-[25%] right-[8%]" style={{ animationDelay: '2s', animationDuration: '10s' }} />
            <FloatingIcon icon={BookOpen} className="w-20 h-20 bottom-[10%] left-[20%]" style={{ animationDelay: '1s', animationDuration: '9s' }} />
            <FloatingIcon icon={FlaskConical} className="w-10 h-10 bottom-[20%] right-[15%]" style={{ animationDelay: '3s', animationDuration: '7s' }} />
            <FloatingIcon icon={Star} className="w-8 h-8 top-[60%] left-[5%]" style={{ animationDelay: '0.5s', animationDuration: '11s' }} />
            <FloatingIcon icon={Beaker} className="w-8 h-8 top-[75%] right-[25%]" style={{ animationDelay: '1.5s', animationDuration: '6s' }} />
        </div>
    );
}
