"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Title from "@/components/Title";
import Container from "@/components/Container";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import MovieFilters from "@/components/MovieFilters";
import MovieSort from "@/components/MovieSort";
import moviesDataRaw from "@/data/full_data_web.json";
import { filterMovies } from "@/lib/filterMovies";
import { sortMovies } from "@/lib/sortMovies";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";

const moviesData: Movie[] = moviesDataRaw as Movie[];
const ITEMS_PER_PAGE = 24;

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageFromParams = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query")?.toLowerCase() || "";
  const genre = searchParams.get("genre") || "";
  const minRating = parseFloat(searchParams.get("rating") || "0");
  const minYear = parseInt(searchParams.get("year") || "1900");
  const sortBy = searchParams.get("sort") || "";

  const filteredMovies = useMemo(() => {
    let filtered = filterMovies(moviesData, query);

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
  }, [query, genre, minRating, minYear, sortBy, searchParams]);

  const [currentPage, setCurrentPage] = useState(pageFromParams);
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(pageFromParams);
  }, [pageFromParams]);

  const handleChangePage = (page: number) => {
    router.push(`/movies?page=${page}`);
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("query", query);
    else params.delete("query");
    params.set("page", "1");
    router.push(`/movies?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleFilter = ({ genre, minRating, minYear }: { genre: string; minRating: number; minYear: number }) => {
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
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 pt-32">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto mb-10">
          <Title subtitle="Zanurz się w świecie filmów" gradientFrom="from-cyan-300" gradientTo="to-indigo-600">
            Baza filmów
          </Title>

          <div className="mt-8 w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>


          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <MovieFilters onFilter={handleFilter} />
          </motion.div>
          
          
          <motion.p
            className="text-white/80 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Strona {currentPage} z {totalPages}
          </motion.p>
          <div className="flex justify-end w-full items-end">
          <MovieSort />
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {paginatedMovies.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap gap-2 justify-center items-center">
            {generatePagination().map((page, idx) =>
              typeof page === "string" ? (
                <span key={`ellipsis-${idx}`} className="px-1 md:px-3 py-2 text-white/50">
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
