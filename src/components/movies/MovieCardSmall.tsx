'use client';

import Image from 'next/image';
import { Movie } from '@/types/movie';

type MovieCardSmallProps = {
  movie: Movie;
  onClick: () => void;
};

const MovieCardSmall = ({ movie, onClick }: MovieCardSmallProps) => {
  return (
    <div
      className="group relative bg-white/10 rounded-lg overflow-hidden shadow-xl flex flex-col cursor-pointer"
      onClick={onClick} // Make the entire div clickable
    >
      {movie.poster_path ? (
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={`Plakat filmu ${movie.title}`}
            fill // Use fill to cover the parent div
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
            className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700 text-white text-center p-4">
          Brak plakatu
        </div>
      )}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div className="text-white">
          <h3 className="text-lg font-bold truncate">{movie.title}</h3>
          <p className="text-sm text-white/70">
            {movie.release_date ? movie.release_date.slice(0, 4) : 'Brak daty'}
          </p>
        </div>
        <button
          className="mt-3 py-1 w-full bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition cursor-pointer"
        >
          Wybierz
        </button>
      </div>
    </div>
  );
};

export default MovieCardSmall;
