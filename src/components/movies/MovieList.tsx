// components/movies/MoviesList.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import MovieCard from "@/components/movies/MovieCard";
import SearchBar from "@/components/global/SearchBar";
import MovieFilters, { FilterValues } from "@/components/movies/MovieFilters";
import MovieSort from "@/components/movies/MovieSort";
import { searchMovies } from "@/lib/searchMovies";
import { sortMovies } from "@/lib/sortMovies";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import Icon  from "@/components/global/Icon";

const ITEMS_PER_PAGE = 24;

type MoviesListProps = {
  movies: Movie[];
};

export default function MoviesList({ movies }: MoviesListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageFromParams = Number(searchParams.get("page") || "1");
  const query = searchParams.get("query")?.toLowerCase() || "";
  const genre = searchParams.get("genre") || "";
  const minRating = parseFloat(searchParams.get("rating") || "0");
  const minYear = parseInt(searchParams.get("year") || "1900", 10) || 1900;
  const sortBy = searchParams.get("sort") || "";

  const filteredSorted = useMemo(() => {
    let result = searchMovies(movies, query).filter((movie) => {
      const genres = movie.genres?.split(", ") ?? [];
      return (
        (genre === "" || genres.includes(genre)) &&
        (movie.vote_average ?? 0) >= minRating &&
        parseInt(movie.release_date?.slice(0, 4) || "0", 10) >= minYear
      );
    });
    return sortMovies(result, sortBy);
  }, [movies, query, genre, minRating, minYear, sortBy]);

  const totalPages = Math.ceil(filteredSorted.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(pageFromParams);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCurrentPage(pageFromParams);
  }, [pageFromParams]);

  const handleSearch = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    q ? params.set("query", q) : params.delete("query");
    params.set("page", "1");
    router.push(`/movies?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleFilter = ({ genre, minRating, minYear }: FilterValues) => {
    const params = new URLSearchParams(searchParams.toString());
    genre ? params.set("genre", genre) : params.delete("genre");
    minRating ? params.set("rating", String(minRating)) : params.delete("rating");
    minYear ? params.set("year", String(minYear)) : params.delete("year");
    params.set("page", "1");
    router.push(`/movies?${params.toString()}`);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/movies?${params.toString()}`);
  };

  const paginated = filteredSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginationList = () => {
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

          <motion.div
            className="w-full mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* DESKTOP */}
            <div className="hidden md:flex w-full items-center justify-between">
              <button
                className="text-white font-semibold flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtrowanie zaawansowane
                {/* ikona obrotu */}
                <Icon
                icon="keyboard_arrow_up"
                  className={`ml-1 transition-transform ${
                    showFilters ? "rotate-0" : "rotate-180"
                  }`}

                />
              </button>
              <span className="text-white/80 text-sm font-medium">
                Strona {currentPage} z {totalPages}
              </span>
              <MovieSort />
            </div>

            {/* MOBILE */}
            <div className="md:hidden grid grid-cols-2 gap-2">
              <span className="col-span-2 text-center text-white/80 text-sm font-medium">
                Strona {currentPage} z {totalPages}
              </span>
              <button
                className="text-white font-semibold flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtrowanie
                <Icon
                icon="keyboard_arrow_up"
                  className={`ml-1 transition-transform ${
                    showFilters ? "rotate-0" : "rotate-180"
                  }`}

                />
              </button>
              <MovieSort />
            </div>

            {/* MODAL FILTRÓW */}
            {showFilters && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setShowFilters(false)}
              >
                <div
                  className="bg-gray-950/20 border border-white/30 backdrop-blur text-white rounded-xl p-6 min-w-[320px] max-w-[95vw] shadow-xl relative"
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
          </motion.div>

          {/* LISTA FILMÓW */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 w-full">
            {paginated.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                <MovieCard movie={movie} isFirstCard={idx === 0} />
              </motion.div>
            ))}
          </div>

          {/* PAGINACJA */}
          <div className="mt-20 flex flex-wrap gap-2 justify-center">
            {paginationList().map((p, idx) =>
              typeof p === "string" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 md:px-3 py-2 text-white/50"
                >
                  {p}
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => handleChangePage(p)}
                  className={`px-3 md:px-4 py-2 rounded-md border transition ${
                    currentPage === p
                      ? "bg-white/30 text-white font-bold"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
