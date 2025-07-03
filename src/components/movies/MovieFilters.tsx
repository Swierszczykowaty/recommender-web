// components/movies/MovieFilters.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/global/Icon";

export type FilterValues = {
  genre: string;
  minRating: number;
  minYear: number;
};

interface MovieFiltersProps {
  onFilter: (filters: FilterValues) => void;
}

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

export default function MovieFilters({ onFilter }: MovieFiltersProps) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
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

  const applyFilters = () => {
    onFilter({
      genre,
      minRating: parseFloat(minRating) || 0,
      minYear: parseInt(minYear, 10) || 0,
    });
    setShow(false);
  };

  return (
    <>
      {/* toggle button */}
      <button
        className="text-white font-semibold flex items-center"
        onClick={() => setShow((v) => !v)}
      >
        Filtrowanie
        <Icon
          icon="keyboard_arrow_up"
          className={`ml-1 transition-transform ${
            show ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {/* modal */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShow(false)}
        >
          <div
            className="bg-gray-950/20 border border-white/30 backdrop-blur text-white rounded-xl p-6 min-w-[320px] max-w-[95vw] shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* tu wklej cały JSX z filtrami */}
            <div className="relative w-full px-2 sm:px-4 py-2">
              <div className="flex flex-col gap-6 items-center w-full max-w-lg mx-auto">
                {/* gatunki */}
                <div className="w-full">
                  <label className="text-white text-sm mb-2 block font-semibold">
                    Wybierz gatunek
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {genresList.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenre(g)}
                        className={`px-2 py-1 rounded-lg text-sm font-medium transition border border-white/30 bg-white/10 text-white hover:bg-white/20
                          ${genre === g ? "font-bold bg-white/30 ring-1" : ""}`}
                      >
                        {g}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setGenre("")}
                      className={`col-span-2 sm:col-span-3 md:col-span-4 px-2 py-1 mt-1 rounded-lg text-sm text-white text-center font-medium border border-white/30 bg-white/10 hover:bg-white/20 transition
                        ${!genre ? "font-bold bg-white/30 ring-1" : ""}`}
                    >
                      Wszystkie
                    </button>
                  </div>
                </div>

                {/* ocena i rok */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
                  <div className="flex flex-col items-start flex-1">
                    <label className="text-white text-sm mb-1">
                      Minimalna ocena
                    </label>
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
                    <label className="text-white text-sm mb-1">
                      Minimalny rok
                    </label>
                    <input
                      type="number"
                      value={minYear}
                      onChange={(e) => setMinYear(e.target.value)}
                      placeholder="np. 2015"
                      className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/80 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* przycisk filtruj */}
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="w-full sm:w-auto px-6 py-2 rounded-lg bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition"
                  >
                    Filtruj
                  </button>
                </div>
              </div>
            </div>
            {/* zamknij */}
            <button
              className="absolute top-3 right-5 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShow(false)}
              aria-label="Zamknij"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
