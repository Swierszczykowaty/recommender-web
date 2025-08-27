"use client";

import React from "react";
import { motion } from "framer-motion";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0 mb-10 lg:mb-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title
            subtitle="Dowiedz się więcej"
            gradientFrom="from-emerald-400"
            gradientVia="via-green-400"
            gradientTo="to-lime-300"
          >
            O Projekcie
          </Title>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/20 text-white shadow-xl"
          >
            <p className="text-sm md:text-lg leading-relaxed text-justify">
              Rekomendner Filmowy to platforma, która pozwala łatwo znaleźć
              filmy dopasowane do Twoich gustów. Wystarczy wybrać jeden tytuł, a
              system na podstawie analizy treści filmu wygeneruje osiem
              najbardziej podobnych propozycji. Oprócz tego możesz przeglądać
              kompletną bazę filmów, sprawdzać szczegółowe opisy i korzystać z
              rankingów: top 100 według ocen, przychodów i liczby głosów.
            </p>

            <p className="text-sm md:text-lg mt-4 text-white text-justify">
              Strona wykorzystuje Content Based Filtering i dane z TMDB. Całość
              działa na Next.js z dynamicznymi komponentami, nowoczesnymi
              animacjami (Framer Motion) i responsywnymi stylami (Tailwind CSS),
              co zapewnia szybkie i wygodne korzystanie na każdym urządzeniu.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
