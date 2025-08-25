import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/global/Icon";
import { motion, AnimatePresence } from "framer-motion";

export type FilterValues = {
  genre: string;
  minRating: number;
  minYear: number;
  language: string;
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

const languagesList = [
  { code: "English", label: "Angielski" },
  { code: "Spanish", label: "Hiszpański" },
  { code: "Polish", label: "Polski" },
  { code: "French", label: "Francuski" },
];

export default function MovieFilters({ onFilter }: MovieFiltersProps) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [language, setLanguage] = useState<string>(
    searchParams.get("language") || ""
  );
  const [genre, setGenre] = useState<string>(searchParams.get("genre") || "");
  const [minRating, setMinRating] = useState<string>(
    searchParams.get("rating") || ""
  );
  const [minYear, setMinYear] = useState<string>(
    searchParams.get("year") || ""
  );

  const resetFilters = () => {
    setGenre("");
    setMinRating("");
    setMinYear("");
  };

  useEffect(() => {
    setGenre(searchParams.get("genre") || "");
    setMinRating(searchParams.get("rating") || "");
    setMinYear(searchParams.get("year") || "");
    setLanguage(searchParams.get("language") || "");
  }, [searchParams]);

  const applyFilters = () => {
    onFilter({
      genre,
      language,
      minRating: parseFloat(minRating) || 0,
      minYear: parseInt(minYear, 10) || 0,
    });
    setShow(false);
  };

  return (
    <>
      {/* toggle button */}
      <button
        className="text-white text-sm font-medium flex items-center"
        onClick={() => setShow((v) => !v)}
      >
        {/* małe ekrany */}
        <span className="block sm:hidden">Filtrowanie</span>
        {/* średnie i duże ekrany */}
        <span className="hidden sm:block">Filtrowanie zaawansowane</span>
        <Icon
          icon="keyboard_arrow_up"
          className={`ml-1 transition-transform ${
            show ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {/* modal z animacją */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 "
            onClick={() => setShow(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              key="modal"
              className="bg-gray-950/20 border border-white/30 backdrop-blur text-white rounded-xl p-4 md:p-6 min-w-[320px] max-w-[90vw] shadow-xl relative "
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-full px-2 sm:px-4 py-2">
                <div className="flex flex-col gap-3 md:gap-6 items-center w-full max-w-lg mx-auto">
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
                  {/* {jezyki} */}
                  <div className="w-full">
                    <label className="text-white text-sm mb-2 block font-semibold">
                      Wybierz język
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {languagesList.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code)}
                          className={`px-2 py-1 rounded-lg text-sm font-medium transition border border-white/30 bg-white/10 text-white hover:bg-white/20
        ${language === lang.code ? "font-bold bg-white/30 ring-1" : ""}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setLanguage("")}
                        className={`col-span-2 sm:col-span-3 md:col-span-4 px-2 py-1 mt-1 rounded-lg text-sm text-white text-center font-medium border border-white/30 bg-white/10 hover:bg-white/20 transition
        ${!language ? "font-bold bg-white/30 ring-1" : ""}`}
                      >
                        Wszystkie języki
                      </button>
                    </div>
                  </div>
                  {/* ocena i rok */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full justify-between">
                    <div className="flex flex-col items-start flex-1">
                      <label className="text-white text-sm mb-1 font-semibold">
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
                        className="w-full px-3 py-1 md:py-2 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring border border-white/20 focus:ring-white/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <label className="text-white text-sm mb-1 font-semibold">
                        Minimalny rok
                      </label>
                      <input
                        type="number"
                        value={minYear}
                        onChange={(e) => setMinYear(e.target.value)}
                        placeholder="np. 2015"
                        className="w-full px-3  py-1 md:py-2 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring border border-white/20 focus:ring-white/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  {/* przyciski: Filtruj + Resetuj */}
                  <div className="w-full flex justify-end items-center space-x-2">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-4 py-2 flex items-center group justify-center rounded-lg bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20 transition "
                    >
                      <Icon
                        icon="cached"
                        className="group-hover:rotate-45 duration-300 "
                      />
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="px-8 py-2 rounded-lg bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
