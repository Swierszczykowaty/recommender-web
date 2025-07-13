// src/components/movies/MovieRankingList.tsx
"use client";

import React from "react";
import type { Movie } from "@/types/movie";
import type { RankingType } from "@/lib/ranking-types";
import MovieRankingCard from "./MovieRankingCard";
import Container from "@/components/global/Container";
import Title from "@/components/global/Title";

interface Props {
  movies: Movie[];
  type: RankingType;
}

const LABELS: Record<RankingType, string> = {
  rating: "Ocena",
  votes: "Liczba głosów",
  revenue: "Zysk (USD)",
};

export default function MovieRankingList({ movies, type }: Props) {
  return (
    <section className="min-h-screen pt-32">
      <Container>
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle={`Na podstawie parametru: ${LABELS[type]}`}
            gradientFrom="from-pink-700"
            gradientVia="via-rose-500"
            gradientTo="to-red-700"
          >
            Ranking Top 100
          </Title>
        </div>
        <div className="space-y-4">
          {movies.map((movie, idx) => (
            <MovieRankingCard
              key={movie.id}
              movie={movie}
              rank={idx + 1}
              type={type}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
