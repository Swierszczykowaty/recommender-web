"use client";

import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import React from "react";
import HeroCard from "@/components/rankings/RankingCard";

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
              gradientTo="to-amber-600"
            >
              Rekomender WWSI
            </Title>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-none lg:grid lg:grid-cols-3 items-stretch justify-center gap-6 lg:gap-8 w-full max-w-6xl mt-8">
            <HeroCard
              href="/recommender"
              icon="insights"
              title="Wygeneruj rekomendacje"
              description="Zobacz filmy polecane specjalnie dla Ciebie."
              buttonText="Rozpocznij"
            />

            <HeroCard
              href="/movies"
              icon="database"
              title="Sprawdź bazę filmów"
              description="Przeglądaj wszystkie dostępne filmy i ich opisy."
              buttonText="Zobacz filmy"
            />

            <HeroCard
              href="/rankings"
              icon="leaderboard"
              title="Poznaj ranking filmowy"
              description="Sprawdź najwyżej oceniane filmy i rankingi gatunków."
              buttonText="Otwórz rankingi"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
