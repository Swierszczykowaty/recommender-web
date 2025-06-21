'use client';
import React from 'react';

type TitleProps = {
  children: React.ReactNode;
  subtitle?: string;
};

export default function Title({ children, subtitle }: TitleProps) {
  return (
    <div className="relative z-10 w-full max-w-4xl text-center">
      <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-amber-600 drop-shadow-lg">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-2 text-md text-white/80">{subtitle}</p>
      )}
    </div>
  );
}
