'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const AnimatedBlob = ({
  className,
  color,
  x = 0,
  y = 0,
  duration = 10,
}: {
  className: string;
  color: string;
  x?: number;
  y?: number;
  duration?: number;
}) => (
  <motion.div
    className={`absolute rounded-full blur-xl pointer-events-none will-change-transform ${className}`}
    animate={{
      y: [0, y, 0],
      x: [0, x, 0],
      backgroundColor: color,
    }}
    transition={{
      backgroundColor: { duration: 0.8, ease: 'easeInOut' },
      x: { duration, repeat: Infinity, ease: 'easeInOut' },
      y: { duration, repeat: Infinity, ease: 'easeInOut' },
    }}
  />
);

const colorConfig = {
  default: [
    'rgba(194, 65, 12, 0.3)',
    'rgba(234, 88, 12, 0.2)',
    'rgba(249, 115, 22, 0.3)',
    'rgba(202, 138, 4, 0.2)',
    'rgba(161, 98, 7, 0.3)',
  ],
  '/movies': [
    'rgba(30, 58, 138, 0.3)',
    'rgba(29, 78, 216, 0.2)',
    'rgba(37, 99, 235, 0.2)',
    'rgba(6, 95, 212, 0.3)',
    'rgba(12, 74, 110, 0.3)',
  ],
  '/recommender': [
    'rgba(88, 28, 135, 0.25)',
    'rgba(147, 51, 234, 0.2)',
    'rgba(236, 72, 153, 0.2)',
    'rgba(244, 114, 182, 0.18)',
    'rgba(109, 40, 217, 0.3)',
  ],
  '/about': [
    'rgba(22, 163, 74, 0.2)',
    'rgba(5, 150, 105, 0.3)',
    'rgba(34, 197, 94, 0.2)',
    'rgba(3, 84, 63, 0.3)',
    'rgba(20, 184, 166, 0.2)',
  ],
} as const;

export default function AnimatedBackground({ dynamicColors }: { dynamicColors?: string[] }) {
  const pathname = usePathname();

  const colors = useMemo(() => {
    if (Array.isArray(dynamicColors) && dynamicColors.length >= 5) return dynamicColors;
    const basePath = '/' + pathname.split('/')[1];
    return colorConfig[basePath as keyof typeof colorConfig] ?? colorConfig.default;
  }, [pathname, dynamicColors]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <AnimatedBlob className="top-0 left-[-10%] w-[1000px] h-[1000px]" color={colors[0]} x={40} y={-80} duration={10} />
      <AnimatedBlob className="top-[30%] right-0 w-[900px] h-[900px]" color={colors[1]} x={-40} y={60} duration={8} />
      <AnimatedBlob className="bottom-60 left-[40%] w-[700px] h-[700px]" color={colors[2]} x={40} y={-60} duration={12} />
      <AnimatedBlob className="bottom-[-10%] left-[20%] w-[600px] h-[600px]" color={colors[3]} x={80} y={-80} duration={14} />
      <AnimatedBlob className="top-[-10%] left-[70%] w-[500px] h-[500px]" color={colors[4]} x={-60} y={-60} duration={10} />
    </div>
  );
}