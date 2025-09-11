"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import SearchBar from "@/components/global/SearchBar";
import MovieCardSmall from "@/components/movies/MovieCardSmall";
import type { Movie } from "@/types/movie";
import top100 from "@/data/top100_votes.json";
import { searchMovies } from "@/lib/searchMovies";
import { motion } from "framer-motion";
import Link from "next/link";

const TOP_MOVIES: Movie[] = top100 as Movie[];

type Engine = "v1" | "v2";

export default function RecommenderSearchPage() {
  const [engine, setEngine] = useState<Engine>("v2");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("reco_engine");
      if (stored === "v1" || stored === "v2") setEngine(stored as Engine);
    } catch {}
  }, []);

  const [allMovies, setAllMovies] = useState<Movie[] | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    window.localStorage.setItem("reco_engine", engine);
  }, [engine]);

  useEffect(() => {
    if (searchQuery && !allMovies) {
      import("@/data/full_data_web.json")
        .then((m) => setAllMovies(m.default as Movie[]))
        .catch((e) => {
          console.error("Nie udało się wczytać full_data_web.json", e);
          setAllMovies([]);
        });
    }
  }, [searchQuery, allMovies]);

  const searchSource: Movie[] = useMemo(
    () => (allMovies && allMovies.length > 0 ? allMovies : TOP_MOVIES),
    [allMovies]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = query.trim() ? searchMovies(searchSource, query) : [];
    setSearchResults(filtered.slice(0, 12));
  };

  const handleMovieSelect = (movie: Movie) => {
    // przekazujemy wybór silnika w query
    router.push(`/recommender/${movie.id}?engine=${engine}`);
  };

  useEffect(() => {
    if (searchQuery === "") {
      const randomSelection = [...TOP_MOVIES]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
      setSearchResults(randomSelection);
    }
  }, [searchQuery]);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden pt-32 mb-10">
      <Container>
        <div className="mb-6 text-center flex justify-center">
          <Title
            subtitle="Wybierz film i model - my znajdziemy podobne"
              gradientLight={{
              from: "from-pink-300",
              via: "via-rose-200",
              to: "to-violet-300",
              subtitleColor: "text-white",
            }}
            gradientDark={{
              from: "from-pink-400",
              via: "via-purple-300",
              to: "to-violet-400",
              subtitleColor: "text-white/80",
            }}
          >
            Generowanie Rekomendacji
          </Title>
        </div>

        {/* Wybór silnika – dwa przyciski */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button
            onClick={() => setEngine("v1")}
            className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer
              ${
                engine === "v1"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            title="Model V1: klasyczny dense KNN"
          >
            Model v1.0
          </button>
          <button
            onClick={() => setEngine("v2")}
            className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer
              ${
                engine === "v2"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            title="Model V2: hybryda BM25+dense"
          >
            Model v2.0
          </button>
          {/* <span className="text-xs text-white/60 ml-2">
            Aktywny: <strong className="text-white">{engine.toUpperCase()}</strong>
          </span> */}
        </motion.div>

        {/* <p className="max-w-2xl mx-auto text-center text-white/70 mb-8 px-2 text-sm md:text-base">
          Wybierz silnik rekomendacji: v1 (klasyczny) lub <strong>v2</strong> (nowszy i dokładniejszy — łączy wyszukiwanie semantyczne z BM25).
          Po wybraniu filmu poniżej pokażemy propozycje, które najbardziej do niego pasują.
          Zawsze możesz przełączyć silnik i porównać wyniki.
        </p> */}

        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Wpisz tytuł filmu..."
          />
          {searchQuery && !allMovies && (
            <p className="text-white/60 text-sm mt-2">
              Ładuję pełną bazę filmów…
            </p>
          )}
        </div>

        {searchResults.length > 0 && (
          <div>
            <motion.div
              className="flex justify-between items-center mb-4 md:mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-md md:text-lg font-semibold text-white/80 text-center">
                {searchQuery ? (
                  <>
                    {/* mobile */}
                    <span className="md:hidden">Wyniki: “{searchQuery}”</span>
                    {/* desktop */}
                    <span className="hidden md:inline">
                      Wyniki dla: “{searchQuery}”
                    </span>
                  </>
                ) : (
                  <>
                    {/* mobile */}
                    <span className="md:hidden">Proponowane:</span>
                    {/* desktop */}
                    <span className="hidden md:inline">Proponowane filmy:</span>
                  </>
                )}
              </h2>

              <Link
                href="/about"
                className="text-sm text-white hover:underline"
                aria-label="Jak działa rekomender?"
              >
                <span className="inline">Jak działa rekomender?</span>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full w-full">
              {searchResults.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <MovieCardSmall
                    movie={movie}
                    onClick={() => handleMovieSelect(movie)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && searchQuery !== "" && (
          <p className="flex justify-center text-white/70 text-sm md:text-lg mt-8">
            Brak wyników dla &quot;{searchQuery}&quot;. Spróbuj innej frazy.
          </p>
        )}
      </Container>
    </section>
  );
}
