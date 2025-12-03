import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/global/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/themeStore";

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
  { code: "English", label: "English" },
  { code: "Spanish", label: "Spanish" },
  { code: "Polish", label: "Polish" },
  { code: "French", label: "French" },
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
  const theme = useThemeStore((state) => state.theme);
  const isLight = theme === "light";

  const triggerClasses = isLight
    ? "text-slate-800 hover:text-slate-900"
    : "text-white hover:text-white";

  const overlayClasses = isLight
    ? "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/5"
    : "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20";

  const modalClasses = isLight
    ? "bg-white border border-slate-200 text-slate-900"
    : "bg-gray-950/20 border border-white/30 text-white";

  const labelClasses = isLight ? "text-slate-800" : "text-white";

  const pillBase =
    "px-2 py-1 rounded-lg text-sm font-medium transition border backdrop-blur";
  const pillIdle = isLight
    ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
    : "border-white/30 bg-white/10 text-white hover:bg-white/20";
  const pillActive = isLight
    ? "font-bold bg-slate-200 border-slate-300 shadow-sm"
    : "font-bold bg-white/30 border-white/40 ring-1";

  const inputClasses = isLight
    ? "w-full px-3 py-1 md:py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
    : "w-full px-3 py-1 md:py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring focus:ring-white/60";

  const resetButtonClasses = isLight
    ? "px-4 py-2 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-sm hover:bg-slate-200 transition"
    : "px-4 py-2 flex items-center group justify-center rounded-lg bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20 transition";

  const applyButtonClasses = isLight
    ? "px-8 py-2 text-sm md:text-md rounded-lg text-slate-100 font-semibold bg-gradient-to-r from-slate-800 to-slate-600 shadow hover:from-slate-700 hover:to-slate-500 transition"
    : "px-8 py-2 text-sm md:text-md rounded-lg bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition";

  const closeButtonClasses = isLight
    ? "absolute top-3 right-5 text-slate-400 hover:text-slate-900 text-2xl"
    : "absolute top-3 right-5 text-gray-400 hover:text-white text-2xl";

  const resetFilters = () => {
    setGenre("");
    setMinRating("");
    setMinYear("");
    setLanguage("");
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
        className={`${triggerClasses} text-sm font-medium flex items-center transition-colors`}
        onClick={() => setShow((v) => !v)}
      >
        {/* małe ekrany */}
        <span className="block sm:hidden">Filtering</span>
        {/* średnie i duże ekrany */}
        <span className="hidden sm:block">Advanced Filtering</span>
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
            className={overlayClasses}
            onClick={() => setShow(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              key="modal"
              className={`${modalClasses} backdrop-blur rounded-xl p-4 md:p-6 min-w-[320px] max-w-[90vw] shadow-xl relative`}
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
                    <label
                      className={`${labelClasses} text-sm mb-2 block font-semibold`}
                    >
                      Select genre
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {genresList.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGenre(g)}
                          className={`${pillBase} ${
                            genre === g ? pillActive : pillIdle
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setGenre("")}
                        className={`${pillBase} col-span-2 sm:col-span-3 md:col-span-4 mt-1 text-center ${
                          !genre ? pillActive : pillIdle
                        }`}
                      >
                        All Genres
                      </button>
                    </div>
                  </div>
                  {/* {jezyki} */}
                  <div className="w-full">
                    <label
                      className={`${labelClasses} text-sm mb-2 block font-semibold`}
                    >
                      Select language
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {languagesList.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code)}
                          className={`${pillBase} ${
                            language === lang.code ? pillActive : pillIdle
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setLanguage("")}
                        className={`${pillBase} col-span-2 sm:col-span-3 md:col-span-4 mt-1 text-center ${
                          !language ? pillActive : pillIdle
                        }`}
                      >
                        All Languages
                      </button>
                    </div>
                  </div>
                  {/* ocena i rok */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full justify-between">
                    <div className="flex flex-col items-start flex-1">
                      <label
                        className={`${labelClasses} text-sm mb-1 font-semibold`}
                      >
                        Minimum Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={10}
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        placeholder="e.g. 7.5"
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <label
                        className={`${labelClasses} text-sm mb-1 font-semibold`}
                      >
                        Minimum Year
                      </label>
                      <input
                        type="number"
                        value={minYear}
                        onChange={(e) => setMinYear(e.target.value)}
                        placeholder="e.g. 2015"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  {/* przyciski: Filtruj + Resetuj */}
                  <div className="w-full flex justify-end items-center space-x-2">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={resetButtonClasses}
                    >
                      <Icon
                        icon="cached"
                        className="group-hover:rotate-45 duration-300 !text-[20px] md:!text-[24px]"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className={applyButtonClasses}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
              {/* zamknij */}
              <button
                className={closeButtonClasses}
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
