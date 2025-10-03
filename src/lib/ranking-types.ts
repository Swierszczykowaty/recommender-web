// src/app/rankings/ranking-types.ts
export const RANKING_TYPES = [
  { key: "rating", label: "Best Rated" },
  { key: "votes", label: "Most Voted" },
  { key: "revenue", label: "Highest Revenue" },
] as const;

export type RankingType = (typeof RANKING_TYPES)[number]["key"];
