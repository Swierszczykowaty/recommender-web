"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import SearchBar from "@/components/global/SearchBar";
import MovieCardSmall from "@/components/movies/MovieCardSmall"; // Import the new MovieCardSmall component
import type { Movie } from "@/types/movie";
import allMovies from "@/data/full_data_web.json";
import { searchMovies } from "@/lib/searchMovies";
import { motion } from "framer-motion";
const movies: Movie[] = allMovies as Movie[];

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
      const filtered = movies
        .filter(
          (m) =>
            !!m.poster_path &&
            m.vote_average &&
            m.vote_average > 7.0 &&
            m.popularity &&
            m.popularity > 80.0
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
      setSearchResults(filtered);
    }
  }, [searchQuery, searchResults.length]);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden pt-32 ">
      <Container>
        <div className="flex flex-col items-center w-full mx-auto mb-20">
          <Title
            subtitle="Wybierz film, a my znajdziemy podobne"
            gradientFrom="from-indigo-400"
            gradientVia="via-fuchsia-400"
            gradientTo="to-purple-400"
          >
            Generowanie Rekomendacji
          </Title>
          <div className="mt-8 mb-4 w-full max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Wpisz tytuł filmu..."
            />
          </div>

          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-xl font-semibold text-white/80 mb-6 text-center">
                {searchQuery
                  ? `Wyniki dla: "${searchQuery}"`
                  : "Wybierz z ostatnio popularnych:"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {searchResults.map((movie) => (
                  <MovieCardSmall
                    key={movie.id}
                    movie={movie}
                    onClick={() => handleMovieSelect(movie)}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {searchResults.length === 0 && searchQuery !== "" && (
            <p className="text-white/70 text-lg mt-8">
              Brak wyników dla &quot;{searchQuery}&quot;. Spróbuj innej frazy.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
