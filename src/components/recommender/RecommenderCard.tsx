"use client";

import { Movie } from "@/types/movie";
import FadeImage from "../global/FadeImage";
import Image from "next/image";

type MovieCardSmallProps = {
  movie: Movie;
  onClick: () => void;
};

const MovieCardSmall = ({ movie, onClick }: MovieCardSmallProps) => {
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Unknown";

  return (
    <div
      className="relative flex items-center gap-4 p-3 bg-white/7 rounded-xl border border-white/20 backdrop-blur-lg overflow-hidden cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
      onClick={onClick}
    >
      {/* Backdrop background */}
      {movie.backdrop_path && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-black/75 backdrop-blur-xs group-hover:bg-black/70 transition-colors duration-300"></div>
        </>
      )}

      {/* Poster */}
      <div className="w-16 sm:w-20 h-24 sm:h-30 flex-shrink-0 rounded-lg overflow-hidden relative z-10 bg-white/10">
        {movie.poster_path ? (
          <FadeImage
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={`Poster of ${movie.title}`}
            width={200}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-xs text-center p-2">
            No poster
          </div>
        )}
      </div>

      {/* Movie info */}
      <div className="flex-1 relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-white/70">{releaseYear}</p>
        {movie.genres && (
          <p className="text-xs text-white/60 line-clamp-1">{movie.genres}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCardSmall;
