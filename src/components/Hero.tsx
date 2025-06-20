'use client';
import Title from '@/components/Title';
import Container from '@/components/Container';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';


export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-16">
      <Container>
        <div className='flex flex-col items-center justify-center relative z-10 w-full text-center'>
          {/* Nagłówek sekcji */}
          <motion.div
          className="relative z-10 w-full max-w-4xl text-center my-20"
          initial={{ opacity: 0, y:-20}} // Stan początkowy: niewidoczny i lekko poniżej
          animate={{ opacity: 1, y: 0 }} // Stan końcowy: w pełni widoczny, na swojej pozycji
          transition={{ duration: 0.6, ease: "easeOut" }} // Czas trwania, opóźnienie i funkcja przejścia
          >
            <Title subtitle="Wybierz, co Cię interesuje">Rekomendacjie filmowe</Title>
          </motion.div>
          {/* Dwa linkowane boxy */}
          <motion.div 
          initial={{ opacity: 0, y: 50 }} // Stan początkowy: niewidoczny i lekko poniżej
          animate={{ opacity: 1, y: 0 }} // Stan końcowy: w pełni widoczny, na swojej pozycji
          transition={{ duration: 0.6, ease: "easeOut" }} // Czas trwania, opóźnienie i funkcja przejścia
            className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 w-full max-w-6xl"
          >
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
          </motion.div>
        </div>
      </Container>
    </section>
  );
}