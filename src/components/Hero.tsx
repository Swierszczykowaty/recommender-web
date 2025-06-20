'use client';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animowane tło */}
      <div className="absolute inset-0 z-0">
        <div className="blur-3xl opacity-30 animate-float-slow absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500 rounded-full" />
        <div className="blur-3xl opacity-30 animate-float-fast absolute top-[30%] right-0 w-[400px] h-[400px] bg-blue-500 rounded-full" />
        <div className="blur-3xl opacity-30 animate-float-medium absolute bottom-0 left-[40%] w-[400px] h-[400px] bg-purple-500 rounded-full" />
      </div>

      {/* Glassmorphism content */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-10 py-16 text-center shadow-xl max-w-lg">
        <h1 className="text-4xl font-bold text-white mb-4">Znajdź swój film</h1>
        <p className="text-white/80 mb-6">
          Odkryj najlepsze rekomendacje filmowe dopasowane do Twoich upodobań.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition">
          <span className="material-icons">play_arrow</span>
          Rozpocznij
        </button>
      </div>
    </section>
  );
}
