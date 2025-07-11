"use client";

import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import HeroBox from "@/components/hero/Hero_box";
import React from "react";


export default function Hero() {
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0 mb-10 md:mb-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <div className="relative z-10 w-full max-w-4xl text-center">
            <Title
              subtitle="Wybierz, co Cię interesuje"
              gradientFrom="from-orange-700"
              gradientVia="via-amber-400"
              gradientTo="to-amber-570"
            >
              Rekomender WWSI
            </Title>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 w-full max-w-6xl mt-8">
            {/* Box 1 */}
            <HeroBox
              href="/recommender"
              icon="insights"
              title="Znajdź coś dla siebie"
              description="Odkryj najlepsze rekomendacje filmowe dopasowane do Twoich upodobań. Kliknij i zobacz, co może Ci się spodobać."
              buttonText="Rozpocznij"
            />
            {/* Box 2 */}
            <HeroBox
              href="/movies"
              icon="database"
              title="Sprawdź bazę filmów"
              description="Przeglądaj pełną bazę filmów dostępnych w systemie, sprawdzaj
                  ich opisy i wybierz coś dla siebie zanim uruchomisz
                  rekomendacje."
              buttonText="Zobacz filmy"
            />
                        <HeroBox
href="/rankings"
icon="leaderboard"
title="Poznaj ranking filmowy"
description="Zobacz, które filmy zdobyły najwyższe noty wśród użytkowników. Przeglądaj zestawienia gatunków i odkryj, co warto obejrzeć jako następne."
buttonText="Otwórz rankingi"

            />
          
          </div>
        </div>
      </Container>
    </section>
  );
}
