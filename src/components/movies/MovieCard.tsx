import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
type MovieCardProps = {
  movie: Movie;
  isFirstCard?: boolean; // DODAJ TO
};
export default function MovieCard({ movie, isFirstCard }: MovieCardProps) {
  const {
    id,
    title = "Brak tytułu",
    poster_path,
    release_date = "—",
    vote_average,
    genres = "—",
  } = movie;

  const getRatingColor = (rating: number | undefined) => {
    if (rating === undefined) return "bg-gray-600";
    if (rating >= 7) return "bg-green-600";
    if (rating >= 5) return "bg-amber-500";
    return "bg-red-600";
  };

  return (
    <Link
      href={`/movies/${id}`}
      className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-xl transition hover:bg-white/20 flex flex-row h-[140px] sm:flex-col sm:h-auto relative"
    >
      {/* Ocena */}
      {typeof vote_average === "number" && (
        <div
          className={`z-50 absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${getRatingColor(
            vote_average
          )}`}
        >
          ★ {vote_average.toFixed(1)}
        </div>
      )}

      {/* Poster */}
      <div className="relative w-[100px] min-w-[100px] h-full sm:w-full sm:h-[350px] overflow-hidden">
        {poster_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            fill
            priority={isFirstCard}
            fetchPriority={isFirstCard ? "high" : undefined}
            className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Tekst */}
      <div className="p-3 text-white flex flex-col justify-center sm:p-4 min-h-[90px] sm:min-h-[100px]">
        <h2 className="text-sm font-semibold line-clamp-2 mb-2 md:mb-0">
          {title}
        </h2>
        <p className="text-white/70 text-xs">{release_date?.slice(0, 4)}</p>
        <p className="text-white/50 text-[10px] italic line-clamp-1">
          {genres}
        </p>
      </div>
    </Link>
  );
}
