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
import type { MinimalMovie } from "@/types/movie-minimal";

const ITEMS_PER_PAGE = 24;

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
  const [error, setError] = useState<string | null>(null);

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

  // Jeden efekt do pobierania danych
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

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
          setError("Nie udało się pobrać wyników. Spróbuj ponownie.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          // mikrotick – zachowaj płynność fade-in
          setTimeout(() => setLoading(false), 0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  // pokazywać toolbar tylko jeśli są faktyczne wyniki
  const hasResults = !loading && !error && items.length > 0;

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

        {/* Toolbar (filtry + sort + licznik stron) tylko gdy są wyniki */}
        {hasResults && (
          <motion.div
            className="relative flex items-center justify-between mb-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <MovieFilters onFilter={handleFilter} />

            {(totalPages > 1) && (
              <span className="text-white/80 text-xs md:text-sm absolute left-1/2 transform -translate-x-1/2">
                Strona {page} z {totalPages}
              </span>
            )}

            <MovieSort />
          </motion.div>
        )}

        {loading ? (
          // SKELETONY
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="skeleton border border-white/20 rounded-lg h-[140px] sm:h-[477px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          // EMPTY STATE
          <div className="w-full max-w-xl mx-auto text-center py-16 px-6 border border-white/15 rounded-xl bg-white/5">
            <div className="text-2xl font-semibold text-white mb-2">
              {error ? "Ups…" : "Brak wyników"}
            </div>
            <p className="text-white/70 mb-6">
              {error
                ? error
                : query
                ? <>Nie znaleźliśmy nic dla frazy „<span className="underline">{query}</span>”.</>
                : "Dopasuj filtry albo wpisz inną frazę."}
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {/* Wyczyść filtry */}
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.delete("query");
                  p.delete("genre");
                  p.delete("language");
                  p.delete("rating");
                  p.delete("year");
                  p.set("page", "1");
                  router.push(`/movies?${p.toString()}`);
                }}
                className="px-4 py-2 rounded-lg text-sm md:text-base border bg-white/10 hover:bg-white/20 text-white border-white/20 duration-300"
              >
                Wyczyść filtry
              </button>

              {/* Pokaż wszystkie */}
              <button
                onClick={() => {
                  const p = new URLSearchParams();
                  p.set("page", "1");
                  p.set("perPage", String(ITEMS_PER_PAGE));
                  router.push(`/movies?${p.toString()}`);
                }}
                className="px-4 py-2 rounded-lg text-sm md:text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 duration-300"
              >
                Pokaż wszystkie filmy
              </button>
            </div>

            {!error && (
              <ul className="text-white/60 text-sm mt-8 space-y-1">
                <li>• Spróbuj krótszej frazy lub innej pisowni.</li>
                <li>• Usuń część filtrów (gatunek, język, rok, ocena).</li>
              </ul>
            )}
          </div>
        ) : (
          <>
            {/* GRID z wynikami */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              {items.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <MovieCard movie={m} isFirstCard={i === 0} />
                </motion.div>
              ))}
            </div>

            {/* Paginacja */}
            {hasResults && totalPages > 1 && (
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
                        page === p
                          ? "bg-white/30 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
