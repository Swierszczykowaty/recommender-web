"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/global/MovieCard";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import type { Movie } from "@/types/movie";
import allMovies from "@/data/full_data_web.json";
import { motion } from "framer-motion";
import Loading from "@/components/global/Loading";
import Icon from "@/components/global/Icon";

export default function RecommendationResultPage() {
  const [baseMovie, setBaseMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const movieId = params.id as string;
  const handleGoBack = () => window.history.back();

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);
      const start = Date.now();

      const movies: Movie[] = allMovies as Movie[];
      const foundBaseMovie = movies.find((m) => m.id.toString() === movieId);
      if (!foundBaseMovie) {
        setError("Nie znaleziono filmu o podanym ID.");
        setLoading(false);
        return;
      }
      setBaseMovie(foundBaseMovie);

      try {
        //const res = await fetch("http://127.0.0.1:8000/api/recommendations",
        const res = await fetch(
          "https://recommender-api-f6qb.onrender.com/api/recommendations",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie_id: foundBaseMovie.id }),
          }
        );
        if (!res.ok) throw new Error("Błąd serwera rekomendacji.");
        const data = await res.json();
        const matched = movies
          .filter((m) =>
            data.recommendations.some((r: { id: number }) => r.id === m.id)
          )
          .filter((m) => m.id !== foundBaseMovie.id);
        setRecommendations(matched.slice(0, 8));
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Wystąpił nieoczekiwany błąd."
        );
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 888 - elapsed;
        if (remaining > 0) {
          await new Promise((r) => setTimeout(r, remaining));
        }
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 sm:pt-32">
      <Container>
        {loading && <Loading message="Generowanie filmów..." />}
        {error && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-red-400 text-center text-lg pt-24">{error}</p>
            <h1>Spróbój ponownie później!</h1>
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 w-full max-w-[250px] justify-center bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/20 duration-300"
            >
              <Icon icon="keyboard_backspace" style={{ fontSize: "20px" }} />
              Powrót
            </button>
          </div>
        )}

        {!loading && !error && baseMovie && (
          <div className="flex flex-col items-center w-full mx-auto">
            <Title
              subtitle="Wygenerowane specjalnie dla Ciebie"
              gradientFrom="from-indigo-400"
              gradientVia="via-fuchsia-400"
              gradientTo="to-purple-400"
            >
              Rekomendacje Filmowe
            </Title>

            <motion.div
              className="mt-12 mb-8 w-full max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold text-white/80 mb-4 text-center">
                Na podstawie filmu:
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white/7 p-6 rounded-2xl border border-white/20 backdrop-blur-lg">
                <div className="w-48 flex-shrink-0">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${baseMovie.poster_path}`}
                    alt={`Plakat filmu ${baseMovie.title}`}
                    width={500}
                    height={750}
                    className="rounded-lg shadow-2xl"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-white">
                    {baseMovie.title}
                  </h3>
                  <p className="text-md text-white/70 mb-3">
                    {baseMovie.release_date?.slice(0, 4)}
                  </p>
                  <p className="text-sm text-white/80 line-clamp-4">
                    {baseMovie.overview}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold text-white/80 mb-6 text-center">
                Oto 8 filmów, które mogą Ci się spodobać:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 w-full">
                {recommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </motion.div>

            <Link
              href="/recommender"
              className="mt-20 px-8 py-3 bg-gradient-to-br from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15 border border-white/30 rounded-lg text-white hover:bg-gradient-to-tr hover:from-indigo-400/35 hover:via-fuchsia-400/45 hover:to-purple-400/55 transition-colors cursor-pointer"
            >
              Wyszukaj inne rekomendacje
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
