// src/components/movies/MovieRankingList.tsx
'use client';

import React from 'react';
import type { Movie } from '@/types/movie';
import type { RankingType } from '@/app/rankings/page';
import MovieCard from '../global/MovieCard';
import Container from "@/components/global/Container";

interface Props {
  movies: Movie[];
  type: RankingType;
}

const LABELS: Record<RankingType, string> = {
  rating:  'Ocena',
  votes:   'Liczba głosów',
  revenue: 'Zysk (USD)',
};

export default function MovieRankingList({ movies, type }: Props) {
  return (
    <section className="min-h-screen pt-32 px-4">
              <Container>

      <h2 className="text-3xl text-white mb-6">
        Top 100 wg&nbsp;{LABELS[type]}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((m, i) => (
          <div key={m.id} className="group relative">
            <span className="absolute top-2 left-2 bg-indigo-600 px-2 py-1 rounded text-white font-bold">
              #{i + 1}
            </span>
            <MovieCard movie={m} />
            <div className="mt-2 text-sm text-white/80">
              {type === 'rating'  && `Ocena: ${m.vote_average}`}
              {type === 'votes'   && `Głosów: ${m.vote_count?.toLocaleString()}`}
              {type === 'revenue' && `Zysk: $${m.revenue?.toLocaleString()}`}
            </div>
          </div>
        ))}
      </div>
            </Container>
      
    </section>
  );
}
