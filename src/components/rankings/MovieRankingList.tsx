// src/components/movies/MovieRankingList.tsx
"use client";

import React from "react";
import type { Movie } from "@/types/movie";
import type { RankingType } from "@/lib/ranking-types";
import MovieRankingCard from "./MovieRankingCard";
import Container from "@/components/global/Container";
import Title from "@/components/global/Title";
import { motion } from "framer-motion";

interface Props {
  movies: Movie[];
  type: RankingType;
}

const LABELS: Record<RankingType, string> = {
  rating: "Ocena",
  votes: "Liczba głosów",
  revenue: "Zysk (USD)",
};
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05, 
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MovieRankingList({ movies, type }: Props) {
  return (
    <section className="min-h-screen pt-32">
      <Container>
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle={`Na podstawie parametru: ${LABELS[type]}`}
            gradientFrom="from-pink-600"
            gradientVia="via-rose-500"
            gradientTo="to-red-700"
          >
            Ranking Top 100
          </Title>
        </div>
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {movies.map((movie, idx) => (
            <motion.div key={movie.id} variants={cardVariants}>
              <MovieRankingCard
                movie={movie}
                rank={idx + 1}
                type={type}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
