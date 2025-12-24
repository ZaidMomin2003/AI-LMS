
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Snowfall: React.FC = () => {
    const [snowflakes, setSnowflakes] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        const generatedSnowflakes = Array.from({ length: 150 }).map((_, i) => {
            const xStart = Math.random() * 100;
            const yStart = -10 - Math.random() * 20;
            const xEnd = xStart + (Math.random() - 0.5) * 40;
            const duration = 5 + Math.random() * 10;
            const scale = 0.2 + Math.random() * 0.8;
            const delay = Math.random() * 15;

            return (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/70"
                    style={{
                        left: `${xStart}%`,
                        top: `${yStart}%`,
                        scale: scale,
                        width: `${scale * 5}px`,
                        height: `${scale * 5}px`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                        x: [`${(xEnd - xStart)}vw`, `${(xEnd - xStart) * 1.1}vw`],
                        y: '120vh',
                        opacity: [1, 0],
                        rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'linear',
                        delay: delay,
                    }}
                />
            );
        });
        setSnowflakes(generatedSnowflakes);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
            {snowflakes}
        </div>
    );
};

export default Snowfall;
