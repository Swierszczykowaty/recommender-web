"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Title from "@/components/global/Title";
import Container from "@/components/layout/Container";

export default function AboutPage() {
  const [selectedSection, setSelectedSection] = useState("overall");
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0 mb-10 lg:mb-0">
      <Container>
        <motion.div 
          layout
          transition={{
            layout: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
          className="relative flex flex-col items-center z-10 w-full mx-auto"
        >
          <motion.div layout className="mb-6 text-center">
            <Title
              subtitle="Dowiedz się więcej"
              gradientLight={{
                from: "from-emerald-300",
                via: "via-green-300",
                to: "to-lime-300",
                subtitleColor: "text-white",
              }}
              gradientDark={{
                from: "from-emerald-400",
                via: "via-green-400",
                to: "to-lime-300",
                subtitleColor: "text-white/80",
              }}
            >
              O Projekcie
            </Title>
          </motion.div>

          <motion.div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedSection("overall")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "overall"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Overall
            </button>
            <button
              onClick={() => setSelectedSection("v1")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "v1"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Model v1
            </button>
            <button
              onClick={() => setSelectedSection("v2")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "v2"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Model v2
            </button>
          </motion.div>

          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/20 text-white shadow-xl"
          >
            {selectedSection === "overall" && (
              <>
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
              </>
            )}

            {selectedSection === "v1" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                Model v1 in progress
              </p>
            )}

            {selectedSection === "v2" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                Model v2 in progress
              </p>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
