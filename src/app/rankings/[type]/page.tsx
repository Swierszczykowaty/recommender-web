import { Suspense } from "react";
import dynamic from "next/dynamic";
import { RANKING_TYPES, RankingType } from "@/lib/ranking-types";
import LoadingMovies from "@/components/global/Loading";

const importRanking = async (type: RankingType) => {
  switch (type) {
    case "votes":
      return (await import("@/data/top100_votes.json")).default;
    case "revenue":
      return (await import("@/data/top100_revenue.json")).default;
    case "rating":
    default:
      return (await import("@/data/top100_rating.json")).default;
  }
};

const MovieRankingList = dynamic(
  () => import("@/components/rankings/MovieRankingList")
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
  const top100 = await importRanking(rankingType);

  return (
    <Suspense fallback={<LoadingMovies message="Loading ranking..." />}>
      <MovieRankingList movies={top100} type={rankingType} />
    </Suspense>
  );
}
