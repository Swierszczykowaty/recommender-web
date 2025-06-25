"use client";

import React from "react";
import { motion } from "framer-motion";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title
            subtitle="Dowiedz się więcej"
            gradientFrom="from-teal-500"
            gradientVia="via-green-400"
            gradientTo="to-green-400"
          >
            O Projekcie
          </Title>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-8 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-xl"
          >
            <p className="text-md md:text-lg leading-relaxed">
              Ten projekt to inteligentna platforma filmowa, która łączy
              nowoczesny interfejs z systemem rekomendacji opartym na danych.
              Umożliwia przeglądanie bazy filmów, wyszukiwanie po tytule lub
              słowach kluczowych oraz znajdowanie podobnych filmów dzięki AI.
            </p>

            <p className="text-md mt-4 text-white/80">
              Wykorzystuje techniki uczenia maszynowego, dane z TMDB oraz
              dynamiczne komponenty zbudowane w Next.js. Dzięki integracji z
              Framer Motion i Tailwind CSS całość działa płynnie i nowocześnie.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
