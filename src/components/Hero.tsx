"use client";

import Title from "@/components/Title";
import Container from "@/components/global/Container";
import HeroBox from "@/components/Hero_box";
import React from "react";


export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-16">
      <Container>
        <div className="flex flex-col items-center justify-center relative z-10 w-full text-center">
          <div className="relative z-10 w-full max-w-4xl text-center my-12">
            <Title
              subtitle="Wybierz, co Cię interesuje"
              gradientFrom="from-orange-500"
              gradientVia="via-yellow-300"
              gradientTo="to-orange-400"
            >
              Rekomender WWSI
            </Title>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 w-full max-w-6xl">
            {/* Box 1 */}
            <HeroBox
              href="/recommender"
              icon="insights"
              title="Znajdź swój film"
              description="Odkryj najlepsze rekomendacje filmowe dopasowane do Twoich upodobań. Kliknij i zobacz, co może Ci się spodobać."
              buttonText="Rozpocznij"
            />
            {/* Box 2 */}
            <HeroBox
              href="/movies"
              icon="storage"
              title="Sprawdź bazę filmów"
              description="Przeglądaj pełną bazę filmów dostępnych w systemie, sprawdzaj
                  ich opisy i wybierz coś dla siebie zanim uruchomisz
                  rekomendacje."
              buttonText="Zobacz filmy"
            />

            
          </div>
        </div>
      </Container>
    </section>
  );
}
