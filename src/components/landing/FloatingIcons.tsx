'use client';

import { BookOpen, BrainCircuit, Lightbulb, Atom, GraduationCap } from 'lucide-react';
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
            <FloatingIcon icon={Lightbulb} className="w-12 h-12 top-[10%] left-[15%]" style={{ animationDelay: '0s', animationDuration: '7s' }} />
            <FloatingIcon icon={BrainCircuit} className="w-16 h-16 top-[20%] right-[10%]" style={{ animationDelay: '1.5s', animationDuration: '9s' }} />
            <FloatingIcon icon={BookOpen} className="w-14 h-14 bottom-[15%] left-[25%]" style={{ animationDelay: '1s', animationDuration: '10s' }} />
            <FloatingIcon icon={GraduationCap} className="w-20 h-20 bottom-[25%] right-[15%]" style={{ animationDelay: '2.5s', animationDuration: '8s' }} />
            <FloatingIcon icon={Atom} className="w-10 h-10 top-[60%] left-[8%]" style={{ animationDelay: '0.5s', animationDuration: '11s' }} />
        </div>
    );
}
