// src/components/movies/MovieRankingCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Movie } from '@/types/movie';
import type { RankingType } from '@/app/rankings/page';

interface Props {
  movie: Movie;
  rank: number;
  type: RankingType;
}

const LABELS: Record<RankingType, string> = {
  rating:  'Ocena',
  votes:   'Głosów',
  revenue: 'Zysk (USD)',
};

export default function MovieRankingCard({ movie, rank, type }: Props) {
  const {
    id,
    backdrop_path,
    poster_path,
    title = 'Brak tytułu',
    release_date = '—',
    genres = '—',
    vote_average,
    vote_count,
    revenue,
  } = movie;

  const getValue = () => {
    switch (type) {
      case 'rating':
        return vote_average != null ? vote_average.toFixed(1) : '—';
      case 'votes':
        return vote_count != null ? vote_count.toLocaleString() : '—';
      case 'revenue':
        return revenue != null ? `$${revenue.toLocaleString()}` : '—';
    }
  };

  return (
    <Link
      href={`/movies/${id}`}
      className="group block w-full h-60 sm:h-64 relative overflow-hidden rounded-xl shadow-lg border border-white/30"
    >
      {/* Tło z backdrop */}
      {backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Gradient dla czytelności */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

      {/* Zawartość: tekst po lewej, poster po prawej */}
      <div className="absolute inset-0 flex items-center p-4 z-10">
        {/* Tekst */}
        <div className="flex-1 text-white">
          <p className="text-lg font-semibold mb-1">
            {rank}. {title}
          </p>
          <p className="text-sm text-white/80 mb-2">
            {release_date.slice(0, 4)} · {genres}
          </p>
          <p className="text-sm">
            {LABELS[type]}:{' '}
            <span className="font-medium">{getValue()}</span>
          </p>
        </div>

        {/* Poster po prawej */}
        {/* {poster_path && (
          <div className="relative w-40 h-full flex-shrink-0 rounded-lg overflow-hidden shadow-lg ml-4">
            <Image
              src={`https://image.tmdb.org/t/p/w342${poster_path}`}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )} */}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition duration-300" />
    </Link>
  );
}
