"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/layout/Container";
import SearchBar from "@/components/global/SearchBar";
import MovieCardSmall from "@/components/recommender/RecommenderCard";
import type { Movie } from "@/types/movie";
import top100 from "@/data/top100_votes.json";
import { searchMovies } from "@/lib/searchMovies";
import { motion } from "framer-motion";
import Link from "next/link";

const TOP_MOVIES: Movie[] = top100 as Movie[];

type Engine = "v1" | "v2" | "gemini";

export default function RecommenderSearchPage() {
  const [engine, setEngine] = useState<Engine>("v2");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("reco_engine");
      if (stored === "v1" || stored === "v2" || stored === "gemini") {
        setEngine(stored as Engine);
      }
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
    // Załaduj pełną bazę danych przy pierwszym renderze
    if (!allMovies) {
      import("@/data/full_data_web.json")
        .then((m) => {
          setAllMovies(m.default as Movie[]);
          // Po załadowaniu danych, jeśli jest aktywne wyszukiwanie, odśwież wyniki
          if (searchQuery.trim()) {
            const filtered = searchMovies(m.default as Movie[], searchQuery);
            setSearchResults(filtered.slice(0, 12));
          }
        })
        .catch((e) => {
          console.error("Nie udało się wczytać full_data_web.json", e);
          setAllMovies([]);
        });
    }
  }, [allMovies, searchQuery]);

  useEffect(() => {
    if (searchQuery === "") {
      const randomSelection = [...TOP_MOVIES]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
      setSearchResults(randomSelection);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Jeśli nie ma query, nie szukaj
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Jeśli nie ma pełnej bazy danych, użyj TOP_MOVIES jako fallback
    // ale priorityzuj pełną bazę danych
    const sourceToUse = allMovies && allMovies.length > 0 ? allMovies : TOP_MOVIES;
    const filtered = searchMovies(sourceToUse, query);
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
            subtitle="Choose a movie and model - we'll find similar ones"
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
            Generate Recommendations
          </Title>
        </div>
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Enter movie title..."
            redirectType="recommender"
          />
          {searchQuery && !allMovies && (
            <p className="text-white/60 text-sm mt-2">
              Loading full movie database…
            </p>
          )}
        </div>
        {/* Wybór silnika – dwa przyciski */}
        <motion.div
          className="flex flex-row items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button
            onClick={() => setEngine("v1")}
            className={`w-full sm:w-auto px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer
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
            className={`w-full sm:w-auto px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer
              ${
                engine === "v2"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            title="Model V2: hybryda BM25+dense"
          >
            Model v2.0
          </button>
          <button
            onClick={() => setEngine("gemini")}
            className={`w-full sm:w-auto px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer
              ${
                engine === "gemini"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            title="Model Gemini: rekomendacje z Google Gemini (limit 100 zapytań na dzień)"
          >
            Gemini (beta)
          </button>
          {/* <span className="text-xs text-white/60 ml-2">
            Aktywny: <strong className="text-white">{engine.toUpperCase()}</strong>
          </span> */}
        </motion.div>

        {/* <p className="max-w-2xl mx-auto text-center text-white/70 mb-8 px-2 text-sm md:text-base">
          Wybierz silnik rekomendacji: v1 (klasyczny) lub <strong>v2</strong> (nowszy i dokładniejszy — łączy wyszukiwanie semantyczne z BM25).
          After selecting a movie below, we'll show you recommendations that best match it.
          You can always switch engines and compare results.
        </p> */}

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
                    <span className="md:hidden">Results for: “{searchQuery}”</span>
                    {/* desktop */}
                    <span className="hidden md:inline">
                      Results for: “{searchQuery}”
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline">Suggested movies:</span>
                  </>
                )}
              </h2>

              <Link
                href="/about"
                className="text-sm text-white hover:underline"
                aria-label="How does the recommender work?"
              >
                <span className="inline sm:hidden">About recommender</span>
                <span className="hidden sm:inline">How does the recommender work?</span>
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
            No results for &quot;{searchQuery}&quot;. Try a different search
            term.
          </p>
        )}
      </Container>
    </section>
  );
}
