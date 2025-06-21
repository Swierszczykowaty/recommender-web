import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Movie } from '@/types/movie';


export default function MovieCard({ movie }: { movie: Movie }) {
  const {
    id,
    title = 'Brak tytułu',
    poster_path,
    release_date = '—',
    vote_average,
    genres = '—'
  } = movie;

  return (
    <Link
      href={`/movies/${id}`}
      className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-xl transition hover:bg-white/20 flex flex-col"
    >
      <div className="relative w-full h-[400px]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 text-white flex flex-col justify-between h-full">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p className="text-white/70 text-sm">
        {release_date} | {typeof vote_average === 'number' ? vote_average.toFixed(1) : '—'} ★
        </p>        <p className="text-white/50 text-xs mt-1 italic">{genres}</p>
      </div>
    </Link>
  );
}
