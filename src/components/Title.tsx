'use client';
import React from 'react';

type TitleProps = {
  children: React.ReactNode;
  subtitle?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  subtitleColor?: string;
};

export default function Title({
  children,
  subtitle,
  gradientFrom = 'from-orange-600',
  gradientVia,
  gradientTo = 'to-amber-600',
  subtitleColor = 'text-white/80',
}: TitleProps) {
  return (
    <div className="relative z-10 w-full max-w-4xl text-center">
      <h2
className={`text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${gradientFrom} ${gradientVia ? gradientVia : ''} ${gradientTo} drop-shadow-lg`}
      >
        {children}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-md ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
}
