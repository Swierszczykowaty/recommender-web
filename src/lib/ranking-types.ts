// src/app/rankings/ranking-types.ts
export const RANKING_TYPES = [
  { key: "rating", label: "Najlepiej oceniane" },
  { key: "votes", label: "Najwięcej głosów" },
  { key: "revenue", label: "Największy zysk" },
] as const;

export type RankingType = (typeof RANKING_TYPES)[number]["key"];
