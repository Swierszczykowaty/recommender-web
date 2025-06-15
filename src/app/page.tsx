'use client';
import React from "react";
import { use, useState } from "react";
import movies from "../data/movies.json";

interface Movie {
  id: number;
  title: string;
}

interface Recommendation {
  id: number;
  title: string;
}

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);

  const fetchRecs = async (id: number) => {
    setSelected(id);
    setRecs([]);
    const res = await fetch("http://127.0.0.1:8000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_id: id }),
    });
    const data = await res.json();
    setRecs(data.recommendations);
  };

  return (
    <div style={{ display: "flex", gap: 40, padding: 40 }}>
      <div>
        <h3>Filmy</h3>
        <ul>
          {(movies as Movie[]).map((m) => (
            <li key={m.id}>
              <button onClick={() => fetchRecs(m.id)}>
                {m.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>
          {selected
            ? `Podobne do: ${(movies as Movie[]).find((m) => m.id === selected)?.title}`
            : "Wybierz film"}
        </h3>
        <ul>
          {recs.map((r) => (
            <li key={r.id}>{r.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
