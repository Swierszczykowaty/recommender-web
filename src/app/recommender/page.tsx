"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import SearchBar from "@/components/global/SearchBar";
import MovieCardSmall from "@/components/movies/MovieCardSmall";
import type { Movie } from "@/types/movie";
import top100 from "@/data/top100_revenue.json";
import { searchMovies } from "@/lib/searchMovies";
import { motion } from "framer-motion";

const movies: Movie[] = top100 as Movie[];

export default function RecommenderSearchPage() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = searchMovies(movies, query);
    setSearchResults(filtered.slice(0, 12));
  };

  const handleMovieSelect = (movie: Movie) => {
    router.push(`/recommender/${movie.id}`);
  };

  useEffect(() => {
    if (searchQuery === "" && searchResults.length === 0) {
      const randomSelection = [...movies]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
      setSearchResults(randomSelection);
    }
  }, [searchQuery, searchResults.length]);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden pt-32 mb-10">
      <Container>
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle="Wybierz film, a my znajdziemy podobne"
              gradientFrom="from-amber-500"
              gradientVia="via-pink-400"
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
        </div>

        {searchResults.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white/80 mb-6 text-center">
              {searchQuery
                ? `Wyniki dla: "${searchQuery}"`
                : "Wybierz albo wyszukaj swój film:"}
            </h2>
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
          <p className="text-white/70 text-lg mt-8">
            Brak wyników dla &quot;{searchQuery}&quot;. Spróbuj innej frazy.
          </p>
        )}
      </Container>
    </section>
  );
}
