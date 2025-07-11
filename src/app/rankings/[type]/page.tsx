// src/app/rankings/[type]/page.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import raw from '@/data/full_data_web.json';
import type { Movie } from '@/types/movie';
import { RANKING_TYPES, RankingType } from '../page';
import LoadingMovies from '@/components/global/Loading';

const MovieRankingList = dynamic(
  () => import('@/components/movies/MovieRankingList')
);

interface Props {
  params: { type: string };
}

export default function RankingPage({ params }: Props) {
  // weryfikacja, czy to nasz typ
  if (!RANKING_TYPES.find((t) => t.key === params.type)) {
    return <p className="text-white p-8">Niepoprawny typ rankingu</p>;
  }

  const type = params.type as RankingType;
  const movies = (raw as Movie[]).slice();

  // sortowanie wg type
  let sorted: Movie[];
  switch (type) {
    case 'votes':
      sorted = movies.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
      break;
    case 'revenue':
      sorted = movies.sort((a, b) => (b.revenue   ?? 0) - (a.revenue   ?? 0));
      break;
    case 'rating':
    default:
      sorted = movies.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
      break;
  }

  const top100 = sorted.slice(0, 100);

  return (
    <Suspense fallback={<LoadingMovies message="Ładowanie rankingu..." />}>
      <MovieRankingList movies={top100} type={type} />
    </Suspense>
  );
}
