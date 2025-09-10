"use client";

import React from "react";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import type { RankingType } from "@/lib/ranking-types";
import FadeImage from "../global/FadeImage";

interface Props {
  movie: Movie;
  rank: number;
  type?: RankingType; // opcjonalny
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
    poster_path,
    title = "Brak tytułu",
    release_date,
    genres = "—",
    vote_average,
    vote_count,
    revenue,
  } = movie;

  // Fallback: najpierw backdrop, jak brak → poster, jak brak obu → null
  const hasBackdrop = Boolean(backdrop_path);
  const hasPoster = Boolean(poster_path);

  const imageSrc = hasBackdrop
    ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
    : hasPoster
      ? `https://image.tmdb.org/t/p/w342${poster_path}`
      : null;

  const imageAlt = hasBackdrop
    ? `Kadr z filmu ${title}`
    : hasPoster
      ? `Plakat filmu ${title}`
      : "";

  const year = release_date ? release_date.slice(0, 4) : "—";

  const getValue = () => {
    if (!type) return "";
    switch (type) {
      case "rating":
        return vote_average != null ? vote_average.toFixed(1) : "—";
      case "votes":
        return vote_count != null ? vote_count.toLocaleString() : "—";
      case "revenue":
        return revenue != null ? `$${revenue.toLocaleString()}` : "—";
      default:
        return "";
    }
  };

  return (
    <Link
      href={`/movies/${id}`}
      className="group block w-full h-44 relative overflow-hidden rounded-xl shadow-lg border border-white/30"
    >
      {imageSrc ? (
        <FadeImage
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            hasBackdrop ? "object-[center_20%]" : "object-contain bg-black/30"
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white/80">
          Brak obrazu
        </div>
      )}

      {/* gradient (poprawiona klasa) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

      <div className="absolute inset-0 flex items-center p-4 z-10">
        <div className="flex-1 text-white">
          <p className="text-lg font-semibold mb-1">
            {rank}. {title}
          </p>
          <p className="text-xs md:text-sm text-white/80 mb-2">
            {year} · {genres}
          </p>

          {type ? (
            <p className="text-xs md:text-sm">
              {LABELS[type]}: <span className="font-medium">{getValue()}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition duration-300" />
    </Link>
  );
}
