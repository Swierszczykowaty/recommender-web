// Zmieniamy MovieFilters, aby aktualizował URL zamiast lokalnego stanu
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const genresList = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Science Fiction",
  "Thriller",
];
type MovieFiltersProps = {
  onFilter: (params: { genre: string; minRating: number; minYear: number }) => void;
};
export default function MovieFilters({ onFilter }: MovieFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [minRating, setMinRating] = useState(
    parseFloat(searchParams.get("rating") || "0")
  );
  const [minYear, setMinYear] = useState(
    parseInt(searchParams.get("year") || "1900")
  );

  const updateURL = () => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (minRating) params.set("rating", minRating.toString());
    if (minYear) params.set("year", minYear.toString());
    router.push("?" + params.toString());
  };

  useEffect(() => {
    setGenre(searchParams.get("genre") || "");
    setMinRating(parseFloat(searchParams.get("rating") || "0"));
    setMinYear(parseInt(searchParams.get("year") || "1900"));
  }, [searchParams]);

  return (
  <div className="flex flex-wrap gap-4 mt-6 justify-center items-end">
  {/* Gatunek */}
  <div className="flex flex-col">
    <label className="text-white text-sm font-medium mb-1">Gatunek</label>
    <select
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
      className="px-3 py-2 rounded bg-white/10 text-white w-48 focus:outline-none focus:ring-2 focus:ring-white/40"
    >
      <option value="">Wszystkie</option>
      {genresList.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  </div>

  {/* Minimalna ocena */}
  <div className="flex flex-col">
    <label className="text-white text-sm font-medium mb-1">Minimalna ocena</label>
    <input
      type="number"
      step="0.1"
      min={0}
      max={10}
      value={minRating}
      onChange={(e) => setMinRating(parseFloat(e.target.value))}
      className="px-3 py-2 rounded bg-white/10 text-white w-48 focus:outline-none focus:ring-2 focus:ring-white/40"
    />
  </div>

  {/* Minimalny rok */}
  <div className="flex flex-col">
    <label className="text-white text-sm font-medium mb-1">Minimalny rok</label>
    <input
      type="number"
      value={minYear}
      onChange={(e) => setMinYear(parseInt(e.target.value))}
      className="px-3 py-2 rounded bg-white/10 text-white w-48 focus:outline-none focus:ring-2 focus:ring-white/40"
    />
  </div>

  {/* Przycisk Filtruj */}
  <div className="flex flex-col">
    <span className="text-transparent mb-1">.</span> {/* aby wyrównać do labeli */}
    <button
      onClick={updateURL}
      className="px-4 py-2 w-48 bg-white/20 text-white rounded hover:bg-white/30 transition"
    >
      Filtruj
    </button>
  </div>
</div>

  );
}
