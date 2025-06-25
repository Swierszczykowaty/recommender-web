import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const genresList = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Drama", "Fantasy", "Horror", "Romance", "Science Fiction",
  "Thriller", "Mystery",
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

  useEffect(() => {
    setGenre(searchParams.get("genre") || "");
    setMinRating(searchParams.get("rating") || "");
    setMinYear(searchParams.get("year") || "");
  }, [searchParams]);

  const updateFilters = () => {
    onFilter({
      genre,
      minRating: parseFloat(minRating) || 0,
      minYear: parseInt(minYear) || 0,
    });
  };

  return (
    <div className="relative w-full px-2 sm:px-4 py-2 ">
      <div className="flex flex-col gap-6 items-center w-full max-w-lg mx-auto">
        {/* Gatunki */}
        <div className="w-full">
          <label className="text-white text-sm mb-2 block font-semibold">Wybierz gatunek</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {genresList.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={`px-2 py-1 rounded-lg text-sm font-medium transition border border-white/30 bg-white/10 text-white hover:bg-white/20
                  ${genre === g ? "font-bold bg-white/30 ring-1" : ""}
                `}
              >
                {g}
              </button>
            ))}
            {/* Wszystkie */}
            <button
              type="button"
              onClick={() => setGenre("")}
              className={`col-span-2 sm:col-span-3 md:col-span-4 px-2 py-1 mt-1 rounded-lg text-sm text-white text-center font-medium border border-white/30 bg-white/10 hover:bg-white/20 transition
                ${!genre ? "font-bold bg-white/30 ring-1" : ""}
              `}
            >
              Wszystkie
            </button>
          </div>
        </div>

        {/* Pozostałe filtry */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
          <div className="flex flex-col items-start flex-1">
            <label className="text-white text-sm mb-1">Minimalna ocena</label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="np. 7.5"
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/80 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div className="flex flex-col items-start flex-1">
            <label className="text-white text-sm mb-1">Minimalny rok</label>
            <input
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="np. 2015"
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/80 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Przycisk */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={updateFilters}
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition"
          >
            Filtruj
          </button>
        </div>
      </div>
    </div>
  );
}
