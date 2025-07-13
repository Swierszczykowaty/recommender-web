// src/components/movies/MovieRankingList.tsx
"use client";

import React from "react";
import type { Movie } from "@/types/movie";
import type { RankingType } from "@/app/rankings/page";
import MovieRankingCard from "./MovieRankingCard";
import Container from "@/components/global/Container";

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
        <h2 className="text-3xl text-white mb-6">
          Top 100 wg&nbsp;{LABELS[type]}
        </h2>
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
