"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

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
  "Mystery",
];

interface MovieFiltersProps {
  onFilter: ({
    genre,
    minRating,
    minYear,
  }: {
    genre: string;
    minRating: number;
    minYear: number;
  }) => void;
}

export default function MovieFilters({ onFilter }: MovieFiltersProps) {
  const searchParams = useSearchParams();
  const [genre, setGenre] = useState<string>(searchParams.get("genre") || "");
  const [minRating, setMinRating] = useState<string>(
    searchParams.get("rating") || ""
  );
  const [minYear, setMinYear] = useState<string>(
    searchParams.get("year") || ""
  );
  const [showGenres, setShowGenres] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);

  const updateFilters = () => {
    onFilter({
      genre,
      minRating: parseFloat(minRating) || 0,
      minYear: parseInt(minYear) || 0,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setShowGenres(false);
      }
    };
    if (showGenres) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showGenres]);

  useEffect(() => {
    setGenre(searchParams.get("genre") || "");
    setMinRating(searchParams.get("rating") || "");
    setMinYear(searchParams.get("year") || "");
  }, [searchParams]);

  return (
    <div className="relative w-full px-4 mt-4">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-6 items-end justify-center relative z-10">
        <div ref={genreRef} className="relative flex flex-col items-start">
          <label className="text-white text-sm mb-1">Wybierz gatunek</label>
          <button
            onClick={() => setShowGenres(!showGenres)}
            className="w-60 px-4 py-[6px] bg-white/10 text-white rounded backdrop-blur hover:bg-white/20 transition text-left"
          >
            {genre ? ` ${genre}` : "Wszystkie gatunki"}
          </button>

          {showGenres && (
            <div className="absolute top-full mt-2 left-0 z-50 bg-gray-900/30 backdrop-blur rounded p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 w-[450px] shadow-lg">
              {genresList.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGenre(g);
                    setShowGenres(false);
                  }}
                  className={`px-2 py-1 rounded text-sm text-white ${
                    genre === g
                      ? "bg-white/30 font-semibold"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {g}
                </button>
              ))}
              <button
                onClick={() => {
                  setGenre("");
                  setShowGenres(false);
                }}
                className="col-span-full px-2 py-1 rounded text-sm text-white text-center bg-white/10 hover:bg-white/20"
              >
                Wszystkie
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start">
          <label className="text-white text-sm mb-1">Minimalna ocena</label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={10}
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            placeholder="np. 7.5"
            className="w-40 px-3 py-[6px] rounded bg-white/10 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-white text-sm mb-1">Minimalny rok</label>
          <input
            type="number"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            placeholder="np. 2015"
            className="w-40 px-3 py-[6px] rounded bg-white/10 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-transparent text-sm mb-1">.</label>
          <button
            onClick={updateFilters}
            className="w-40 px-4 py-[6px] bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition"
          >
            Filtruj
          </button>
        </div>
      </div>
    </div>
  );
}
