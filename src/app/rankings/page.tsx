// src/app/rankings/page.tsx
import Link from 'next/link';

export const RANKING_TYPES = [
  { key: 'rating',  label: 'Najlepiej oceniane' },
  { key: 'votes',   label: 'Najwięcej głosów' },
  { key: 'revenue', label: 'Największy zysk' },
] as const;

export type RankingType = typeof RANKING_TYPES[number]['key'];

export default function RankingsIndex() {
  return (
    <main className="min-h-screen pt-32 flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold text-white mb-8">Ranking Top 100</h1>
      <div className="flex flex-col space-y-2">
        {RANKING_TYPES.map((t) => (
          <Link
            key={t.key}
            href={`/rankings/${t.key}`}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-lg text-center"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
