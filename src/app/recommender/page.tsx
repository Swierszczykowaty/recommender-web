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

export default function RecommenderSearchPage() {
  const [allMovies, setAllMovies] = useState<Movie[] | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

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
    // przekierowanie bez parametru engine - model będzie wybrany na następnej stronie
    router.push(`/recommender/${movie.id}`);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
                  className="h-full"
                >
                  <Link href={`/recommender/${movie.id}`} prefetch={true}>
                    <MovieCardSmall
                      movie={movie}
                      onClick={() => {}}
                    />
                  </Link>
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
