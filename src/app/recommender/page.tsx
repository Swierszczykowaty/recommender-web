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

export default function RecommenderSearchPage() {
  const [allMovies, setAllMovies] = useState<Movie[] | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (searchQuery && !allMovies) {
      import("@/data/full_data_web.json")
        .then((m) => setAllMovies(m.default as Movie[]))
        .catch((e) => {
          console.error("Nie udało się wczytać all_movies.json", e);
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
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle="Wybierz film, a my znajdziemy podobne"
            gradientFrom="from-pink-400"
            gradientVia="via-purple-300"
            gradientTo="to-violet-400"
          >
            Generowanie Rekomendacji
          </Title>
        </div>

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
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-md md:text-lg font-semibold text-white/80 mb-4 md:mb-6 text-center">
                {searchQuery
                  ? `Wyniki dla: "${searchQuery}"`
                  : "Proponowane filmy:"}
              </h2>
              <Link
                href="/about"
                className="text-sm text-white hover:underline"
              >
                Jak działa rekomender?
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
