'use client';
import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
