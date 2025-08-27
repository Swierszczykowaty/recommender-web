"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import MovieCard from "@/components/global/MovieCard";
import SearchBar from "@/components/global/SearchBar";
import MovieFilters, { FilterValues } from "@/components/movies/MovieFilters";
import MovieSort from "@/components/movies/MovieSort";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 24;

type MinimalMovie = {
  id: number | string;
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  genres?: string | null;
  spoken_languages?: string | null;
};

export default function MoviesList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || "1");
  const query = searchParams.get("query")?.toLowerCase() || "";
  const genre = searchParams.get("genre") || "";
  const language = searchParams.get("language") || "";
  const minRating = searchParams.get("rating") || "";
  const minYear = searchParams.get("year") || "";
  const sortBy = searchParams.get("sort") || "";

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MinimalMovie[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // budujemy URL do API na podstawie searchParams
  const apiUrl = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("perPage", String(ITEMS_PER_PAGE));
    if (query) p.set("query", query);
    if (genre) p.set("genre", genre);
    if (language) p.set("language", language);
    if (minRating) p.set("rating", minRating);
    if (minYear) p.set("year", minYear);
    if (sortBy) p.set("sort", sortBy);
    return `/api/movies?${p.toString()}`;
  }, [page, query, genre, language, minRating, minYear, sortBy]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(apiUrl, { cache: "force-cache" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((e) => {
        console.error("Movies fetch error:", e);
        if (!cancelled) {
          setItems([]);
          setTotalPages(1);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const handleSearch = (q: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (q) p.set("query", q);
    else p.delete("query");
    p.set("page", "1");
    router.push(`/movies?${p.toString()}`);
  };

  const handleFilter = ({ genre, language, minRating, minYear }: FilterValues) => {
    const p = new URLSearchParams(searchParams.toString());
    if (genre) p.set("genre", genre); else p.delete("genre");
    if (language) p.set("language", language); else p.delete("language");
    if (minRating) p.set("rating", String(minRating)); else p.delete("rating");
    if (minYear) p.set("year", String(minYear)); else p.delete("year");
    p.set("page", "1");
    router.push(`/movies?${p.toString()}`);
  };

  const handlePage = (pg: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", String(pg));
    router.push(`/movies?${p.toString()}`);
  };

  const pagesList = () => {
    const L: (number | string)[] = [];
    if (totalPages <= 10) return Array.from({ length: totalPages }, (_, i) => i + 1);
    L.push(1);
    if (page > 4) L.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) L.push(i);
    if (page < totalPages - 3) L.push("...");
    L.push(totalPages);
    return L;
  };

  return (
    <section className="relative min-h-screen pt-32 flex justify-center mb-10">
      <Container>
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle="Zanurz się w świecie filmów"
            gradientFrom="from-teal-400"
            gradientTo="to-blue-400"
            link="/movies"
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
          <span className="text-white/80 text-xs md:text-sm absolute left-1/2 transform -translate-x-1/2 ">
            Strona {page} z {totalPages}
          </span>
          <MovieSort />
        </motion.div>

        {loading ? (
          <p className="text-white/70">Ładowanie…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              {items.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MovieCard movie={m as any} isFirstCard={i === 0} />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {pagesList().map((p, i) =>
                typeof p === "string" ? (
                  <span key={`e${i}`} className="px-2 py-1 text-white/50">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`px-3 md:px-4 py-2 rounded-lg border ${
                      page === p ? "bg-white/30 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
