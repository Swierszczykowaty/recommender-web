import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import raw from '@/data/full_data_web.json';
import type { Movie } from '@/types/movie';
import { RANKING_TYPES, RankingType } from '@/lib/ranking-types';
import LoadingMovies from '@/components/global/Loading';

const MovieRankingList = dynamic(
  () => import('@/components/rankings/MovieRankingList')
);

type ResolvedPageParams = { type: string };
interface RankingPageProps {
  params: Promise<ResolvedPageParams>;
}

export default async function RankingPage({ params }: RankingPageProps) {

  const awaitedParams = await params;
  const { type } = awaitedParams; 

  if (!RANKING_TYPES.find((t) => t.key === type)) {
    return <p className="text-white p-8">Niepoprawny typ rankingu</p>;
  }

  const rankingType = type as RankingType;
  const movies = (raw as Movie[]).slice();

  // sortowanie wg type
  let sorted: Movie[];
  switch (rankingType) {
    case 'votes':
      sorted = movies.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
      break;
    case 'revenue':
      sorted = movies.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
      break;
    case 'rating':
    default:
      sorted = movies.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
      break;
  }

  const top100 = sorted.slice(0, 100);

  return (
    <Suspense fallback={<LoadingMovies message="Ładowanie rankingu..." />}>
      <MovieRankingList movies={top100} type={rankingType} />
    </Suspense>
  );
}