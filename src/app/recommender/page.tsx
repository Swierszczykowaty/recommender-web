'use client';
import React, { useState } from 'react';
import movies from '@/data/movies.json'; // Importuj dane filmów z pliku JSON

interface Movie {
  id: number;
  title: string;
}

interface Recommendation {
  id: number;
  title: string;
}

export default function RecommenderPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);

  const fetchRecs = async (id: number) => {
    setSelected(id);
    setRecs([]);
    const res = await fetch('http://127.0.0.1:8000/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_id: id }),
    });
    const data = await res.json();
    setRecs(data.recommendations);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
      <div>
        <h2 className="text-lg font-semibold mb-4">Wybierz film</h2>
        <ul className="space-y-2 text-black">
          {(movies as Movie[]).map((m) => (
            <li key={m.id}>
              <button
                onClick={() => fetchRecs(m.id)}
                className="w-full text-left bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-blue-100 transition"
              >
                {m.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selected
            ? `Podobne do: ${(movies as Movie[]).find((m) => m.id === selected)?.title}`
            : 'Wybierz film z lewej strony'}
        </h2>
        <ul className="space-y-2 text-black">
          {recs.map((r) => (
            <li
              key={r.id}
              className="bg-white border border-gray-300 rounded-md px-4 py-2"
            >
              {r.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
