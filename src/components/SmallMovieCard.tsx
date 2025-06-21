'use client';

import Image from 'next/image';
import type { Movie } from '@/types/movie';

interface SmallMovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export default function SmallMovieCard({ movie, onSelect }: SmallMovieCardProps) {
  return (
    <div
      className="w-full flex items-center gap-6 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition cursor-pointer"
      onClick={() => onSelect(movie)}
    >
      <div className="w-20 h-30 relative flex-shrink-0">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="rounded object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex-1 text-white overflow-hidden">
        <h3 className="text-xl font-semibold truncate">{movie.title}</h3>
        <p className="text-white/60 text-sm">{movie.release_date?.slice(0, 4)}</p>
        <p className="text-white/80 text-sm truncate">
          {Array.isArray(movie.genres)
            ? movie.genres.join(', ')
            : typeof movie.genres === 'string'
            ? movie.genres
            : 'Brak danych'}
        </p>
      </div>

      <button className="ml-4 px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded">
        Wybierz
      </button>
    </div>
  );
}
