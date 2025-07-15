// components/movies/MoviesList.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import MovieCard from "@/components/global/MovieCard";
import SearchBar from "@/components/global/SearchBar";
import MovieFilters, { FilterValues } from "@/components/movies/MovieFilters";
import MovieSort from "@/components/movies/MovieSort";
import { searchMovies } from "@/lib/searchMovies";
import { sortMovies } from "@/lib/sortMovies";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";

const ITEMS_PER_PAGE = 24;

export default function MoviesList({ movies }: { movies: Movie[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || "1");
  const query = searchParams.get("query")?.toLowerCase() || "";
  const genre = searchParams.get("genre") || "";
  const language = searchParams.get("language") || "";
  const minRating = parseFloat(searchParams.get("rating") || "0");
  const minYear = parseInt(searchParams.get("year") || "1900", 10) || 1900;
  const sortBy = searchParams.get("sort") || "";

const filtered = useMemo(() => {
  const f = searchMovies(movies, query).filter((movie) => {
    const g = movie.genres?.split(", ") ?? [];
    const langs = (movie.spoken_languages ?? "")
      .split(",")
      .map((l) => l.trim().toLowerCase());

    return (
      (genre === "" || g.includes(genre)) &&
      (movie.vote_average ?? 0) >= minRating &&
      parseInt(movie.release_date?.slice(0, 4) || "0", 10) >= minYear &&
      (language === "" || langs.includes(language.toLowerCase()))
    );
  });
  return sortMovies(f, sortBy);
}, [movies, query, genre, minRating, minYear, sortBy, language]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

const handleSearch = (q: string) => {
  const p = new URLSearchParams(searchParams.toString());
  if (q) {
    p.set("query", q);
  } else {
    p.delete("query");
  }
  p.set("page", "1");
  router.push(`/movies?${p.toString()}`);
  setCurrentPage(1);
};

const handleFilter = ({ genre, language, minRating, minYear }: FilterValues) => {
  const p = new URLSearchParams(searchParams.toString());

  if (genre) {
    p.set("genre", genre);
  } else {
    p.delete("genre");
  }

  if (language) {
    p.set("language", language);
  } else {
    p.delete("language");
  }

  if (minRating) {
    p.set("rating", String(minRating));
  } else {
    p.delete("rating");
  }

  if (minYear) {
    p.set("year", String(minYear));
  } else {
    p.delete("year");
  }

  p.set("page", "1");
  router.push(`/movies?${p.toString()}`);
  setCurrentPage(1);
};


  const handlePage = (pg: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", String(pg));
    router.push(`/movies?${p.toString()}`);
  };

  const pageItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pagesList = () => {
    const L: (number | string)[] = [];
    if (totalPages <= 10)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    L.push(1);
    if (currentPage > 4) L.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      L.push(i);
    if (currentPage < totalPages - 3) L.push("...");
    L.push(totalPages);
    return L;
  };

  return (
    <section className="relative min-h-screen pt-32 flex justify-center mb-10">
      <Container>
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle="Zanurz się w świecie filmów"
            gradientFrom="from-cyan-300"
            gradientTo="to-indigo-600"
          >
            Baza filmów
          </Title>
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <motion.div
          className="relative flex items-center justify-between mb-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <MovieFilters onFilter={handleFilter} />

          <span className="text-white/80 text-sm absolute left-1/2 transform -translate-x-1/2 ">
            Strona {currentPage} z {totalPages}
          </span>

          <MovieSort />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {pageItems.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MovieCard movie={m} isFirstCard={i === 0} />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {pagesList().map((p, i) =>
            typeof p === "string" ? (
              <span key={`e${i}`} className="px-2 py-1 text-white/50">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handlePage(p)}
                className={`px-3 md:px-4 py-2 rounded-lg border ${
                  currentPage === p
                    ? "bg-white/30 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      </Container>
    </section>
  );
}
