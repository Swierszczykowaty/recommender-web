'use client';

import Image from 'next/image';
import type { Movie } from '@/types/movie';
import Link from 'next/link';

interface SmallMovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export default function SmallMovieCard({ movie, onSelect }: SmallMovieCardProps) {
  return (
    <div
      className="w-full flex flex-col xl:flex-row items-center gap-6 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition cursor-pointer"
    >
      <div className="flex items-start gap-4 w-full">
        <div className="w-20 h-28 relative flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="rounded object-cover"
            sizes="96px"
          />
        </div>

        <div className="flex-1 text-white overflow-hidden">
          <h3 className="text-sm md:text-lg font-semibold line-clamp-2 ">{movie.title}</h3>
          <p className="text-white/70 text-xs mt-1">{movie.release_date?.slice(0, 4)}</p>
          <p className="text-white/70 text-xs line-clamp-1">Ocena: {movie.vote_average?.toFixed(1) ?? '–'}</p>
          <p className="text-white/80 text-xs italic truncate">
            {Array.isArray(movie.genres)
              ? movie.genres.join(', ')
              : typeof movie.genres === 'string'
              ? movie.genres
              : 'Brak danych'}
          </p>
        </div>
      </div>
      <div className='flex flex-row xl:flex-col items-end gap-2 w-full xl:w-auto '>
        <Link
          href={`/movies/${movie.id}`}
          className="w-full ml-0 xl:ml-2 px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded cursor-pointer text-sm text-center"
          >
        <button>
          Zobacz w bazie
        </button>
        </Link>
        <button 
        className="w-full ml-0 xl:ml-2 px-5 py-2 bg-amber-300/20 hover:bg-white/30 text-white rounded cursor-pointer text-sm "
        onClick={() => onSelect(movie)}>
          Generuj podobne
        </button>
      </div>
    </div>
  );
}
