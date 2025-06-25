"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import MovieCard from "@/components/movies/MovieCard";
import SearchBar from "@/components/global/SearchBar";
import MovieFilters from "@/components/movies/MovieFilters";
import MovieSort from "@/components/movies/MovieSort";
import { filterMovies } from "@/lib/filterMovies";
import { sortMovies } from "@/lib/sortMovies";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";

const ITEMS_PER_PAGE = 24;
type MoviesListProps = {
  movies: Movie[];
};
export default function MoviesList({ movies }: MoviesListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageFromParams = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query")?.toLowerCase() || "";
  const genre = searchParams.get("genre") || "";
  const minRating = parseFloat(searchParams.get("rating") || "0");
  const minYear = parseInt(searchParams.get("year") || "1900");
  const sortBy = searchParams.get("sort") || "";

  const filteredMovies = useMemo(() => {
    let filtered = filterMovies(movies, query);

    filtered = filtered.filter((movie) => {
      const genreList = movie.genres?.split(", ") ?? [];
      const matchesGenre = genre === "" || genreList.includes(genre);
      const matchesRating = (movie.vote_average ?? 0) >= minRating;
      const matchesYear = !isNaN(minYear)
        ? parseInt(movie.release_date?.slice(0, 4) || "0") >= minYear
        : true;

      return matchesGenre && matchesRating && matchesYear;
    });

    return sortMovies(filtered, sortBy);
  }, [movies, query, genre, minRating, minYear, sortBy]);

  const [currentPage, setCurrentPage] = useState(pageFromParams);
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(pageFromParams);
  }, [pageFromParams]);

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/movies?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("query", query);
    else params.delete("query");
    params.set("page", "1");
    router.push(`/movies?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleFilter = ({
    genre,
    minRating,
    minYear,
  }: {
    genre: string;
    minRating: number;
    minYear: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genre) params.set("genre", genre);
    else params.delete("genre");
    if (minRating) params.set("rating", String(minRating));
    else params.delete("rating");
    if (minYear) params.set("year", String(minYear));
    else params.delete("year");
    params.set("page", "1");
    router.push(`/movies?${params.toString()}`);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const generatePagination = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // ------- NOWE: stan modala filtrów --------
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // po pierwszym renderze — pokaż animację
    setMounted(true);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto mb-10">
          <Title
            subtitle="Zanurz się w świecie filmów"
            gradientFrom="from-cyan-300"
            gradientTo="to-indigo-600"
          >
            Baza filmów
          </Title>

          <div className="mt-8 w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Wrapper */}
          <motion.div
            className="w-full mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Desktop: flex, Mobile: grid */}
            <div className="hidden md:flex w-full items-center justify-between">
              {/* Lewo */}
              <div>
                <button
                  className="text-white font-semibold cursor-pointer"
                  onClick={() => setShowFilters(true)}
                >
                  Filtrowanie zaawansowane
                </button>
                {/* Modal z filtrami */}
                {showFilters && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setShowFilters(false)}
                  >
                    <div
                      className="bg-gray-950/20 border border-white/30 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl p-6 min-w-[320px] max-w-[95vw] shadow-xl relative "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MovieFilters onFilter={handleFilter} />
                      <button
                        className="absolute top-3 right-5 text-gray-400 hover:text-white text-2xl "
                        onClick={() => setShowFilters(false)}
                        aria-label="Zamknij"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Środek */}
              <div className="flex-1 flex justify-center">
                <span className="text-white/80 text-sm font-medium whitespace-nowrap">
                  Strona {currentPage} z {totalPages}
                </span>
              </div>
              {/* Prawo */}
              <div>
                <MovieSort />
              </div>
            </div>
            {/* MOBILE: grid */}
            <div className="md:hidden grid grid-cols-2 gap-2">
              {/* Góra (strona wyśrodkowana na pełnej szerokości) */}
              <div className="col-span-2 flex justify-center mb-1">
                <span className="text-white/80 text-sm font-medium whitespace-nowrap">
                  Strona {currentPage} z {totalPages}
                </span>
              </div>
              {/* Lewy dolny przycisk */}
              <div className="flex justify-start">
                <button
                  className="text-white font-semibold"
                  onClick={() => setShowFilters(true)}
                >
                  Filtrowanie
                </button>
                {/* Modal jak wyżej */}
                {showFilters && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setShowFilters(false)}
                  >
                    <div
                      className="bg-gray-950/20 border border-white/30 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl p-6 min-w-[320px] max-w-[95vw] shadow-xl relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MovieFilters onFilter={handleFilter} />
                      <button
                        className="absolute top-3 right-5 text-gray-400 hover:text-white text-2xl"
                        onClick={() => setShowFilters(false)}
                        aria-label="Zamknij"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Prawy dolny przycisk */}
              <div className="flex justify-end">
                <MovieSort />
              </div>
            </div>
          </motion.div>

          {/* LISTA FILMÓW */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {paginatedMovies.map((movie, idx) => (
              <div key={movie.id}
                className={`w-full mt-4 fade-up ${mounted ? "visible" : ""}`}
              >
                <MovieCard movie={movie} isFirstCard={idx === 0} />
              </div>
            ))}
          </div>

          {/* PAGINACJA */}
          <div className="mt-20 flex flex-wrap gap-2 justify-center items-center">
            {generatePagination().map((page, idx) =>
              typeof page === "string" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 md:px-3 py-2 text-white/50"
                >
                  …
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => handleChangePage(page)}
                  className={`px-3 md:px-4 py-2 rounded-md border transition ${
                    currentPage === page
                      ? "bg-white/30 text-white font-bold"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
