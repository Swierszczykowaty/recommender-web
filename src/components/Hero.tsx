'use client';
import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 px-4 md:px-8 py-16">
      {/* Animowane tło */}
      <div className="absolute inset-0 z-0">
        <div className="blur-3xl opacity-30 animate-float-slow absolute top-0 left-0 w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] bg-orange-500 rounded-full" />
        <div className="blur-3xl opacity-30 animate-float-fast absolute top-[30%] right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] bg-yellow-500 rounded-full" />
        <div className="blur-3xl opacity-30 animate-float-medium absolute bottom-60 left-[30%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] bg-amber-500 rounded-full" />
      </div>
        <div className='flex flex-col items-center justify-center relative z-10 w-full text-center'>
            {/* Nagłówek sekcji */}
            <div className="relative z-10 w-full max-w-4xl text-center mb-26">
                <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-amber-600 drop-shadow-lg">
                    Rekomendacje filmowe
                </h2>
                <p className="mt-2 text-lg text-white/80">
                    Wybierz, co Cię interesuje
                </p>
            </div>

        {/* Dwa linkowane boxy */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 w-full max-w-6xl">
            {/* Box 1 */}
            <Link href="/recommender" className="group flex-1 min-h-[300px] flex flex-col justify-between bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-12 text-center shadow-xl transition hover:bg-white/20">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-4 ">Znajdź swój film</h1>
                    <p className="text-white/80 text-base mb-6">
                    Odkryj najlepsze rekomendacje filmowe dopasowane do Twoich upodobań. Kliknij i zobacz, co może Ci się spodobać.
                    </p>
                </div>
                <div className="inline-flex items-center justify-center gap-2 text-white border border-white/30 rounded-lg px-6 py-3 bg-white/10 group-hover:bg-white/20 transition">
                    <span className="material-icons">play_arrow</span>
                    Rozpocznij
                </div>
            </Link>

            {/* Box 2 */}
            <Link href="/movies" className="group flex-1 min-h-[300px] flex flex-col justify-between bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-12 text-center shadow-xl transition hover:bg-white/20">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-4 ">Sprawdź bazę filmów</h1>
                    <p className="text-white/80 text-base mb-6">
                    Przeglądaj pełną bazę filmów dostępnych w systemie, sprawdzaj ich opisy i wybierz coś dla siebie zanim uruchomisz rekomendacje.
                    </p>
                </div>
                <div className="inline-flex items-center justify-center gap-2 text-white border border-white/30 rounded-lg px-6 py-3 bg-white/10 group-hover:bg-white/20 transition">
                    <span className="material-icons">search</span>
                    Zobacz filmy
                </div>
            </Link>
        </div>
      </div>
    </section>
  );
}
