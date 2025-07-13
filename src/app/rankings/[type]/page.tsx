import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import raw from '@/data/full_data_web.json';
import type { Movie } from '@/types/movie';
import { RANKING_TYPES, RankingType } from '@/lib/ranking-types';
import LoadingMovies from '@/components/global/Loading';

const MovieRankingList = dynamic(
  () => import('@/components/rankings/MovieRankingList')
);

// Define the shape of the object that the 'params' Promise will resolve to.
type ResolvedPageParams = { type: string };

// Define the props for the RankingPage component.
// Crucially, we are telling TypeScript that 'params' will *always* be a Promise
// that resolves to our ResolvedPageParams. This satisfies Next.js's internal
// PageProps constraint which expects 'params' to be Promise<any>.
interface RankingPageProps {
  params: Promise<ResolvedPageParams>;
  // If your page also accepts search parameters (e.g., /rankings/votes?page=1),
  // you would also define them here, similarly possibly wrapped in a Promise
  // if Next.js's internal types demand it for searchParams as well (less common for searchParams).
  // searchParams?: { [key: string]: string | string[] | undefined };
}

// NAJWAŻNIEJSZE:
export default async function RankingPage({ params }: RankingPageProps) {
  // Await params because the Next.js runtime explicitly gave an error
  // stating it should be awaited.
  const awaitedParams = await params;
  const { type } = awaitedParams; // Access the 'type' property from the resolved object.

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