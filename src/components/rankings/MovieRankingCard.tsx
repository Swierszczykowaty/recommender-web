// src/components/movies/MovieRankingCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import type { RankingType } from "@/lib/ranking-types";

interface Props {
  movie: Movie;
  rank: number;
  type: RankingType;
}

const LABELS: Record<RankingType, string> = {
  rating: "Ocena",
  votes: "Głosów",
  revenue: "Zysk (USD)",
};

export default function MovieRankingCard({ movie, rank, type }: Props) {
  const {
    id,
    backdrop_path,
    title = "Brak tytułu",
    release_date = "—",
    genres = "—",
    vote_average,
    vote_count,
    revenue,
  } = movie;

  const getValue = () => {
    switch (type) {
      case "rating":
        return vote_average != null ? vote_average.toFixed(1) : "—";
      case "votes":
        return vote_count != null ? vote_count.toLocaleString() : "—";
      case "revenue":
        return revenue != null ? `$${revenue.toLocaleString()}` : "—";
    }
  };

  return (
    <Link
      href={`/movies/${id}`}
      className="group block w-full h-44 relative overflow-hidden rounded-xl shadow-lg border border-white/30"
    >
      {backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={title}
          fill
          className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105 "
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

      <div className="absolute inset-0 flex items-center p-4 z-10">
        <div className="flex-1 text-white">
          <p className="text-lg font-semibold mb-1">
            {rank}. {title}
          </p>
          <p className="text-xs md:text-sm text-white/80 mb-2">
            {release_date.slice(0, 4)} · {genres}
          </p>
          <p className="text-xs md:text-sm">
            {LABELS[type]}: <span className="font-medium">{getValue()}</span>
          </p>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition duration-300" />
    </Link>
  );
}
