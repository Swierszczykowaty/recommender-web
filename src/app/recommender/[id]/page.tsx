"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Title from "@/components/global/Title";
import Container from "@/components/layout/Container";
import type { Movie } from "@/types/movie";
import allMovies from "@/data/full_data_web.json";
import { motion } from "framer-motion";
import Loading from "@/components/global/Loading";
import Icon from "@/components/global/Icon";
import MovieRankingCard from "@/components/rankings/MovieRankingCard";
import FadeImage from "@/components/global/FadeImage";
import { useEngineStore } from "@/lib/engineStore";

type Engine = "v1" | "v2";

export default function RecommendationResultPage() {
  const [baseMovie, setBaseMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const movieId = params.id as string;
  const engine = (searchParams.get("engine") as Engine) || "v2";
  const { setEngineReady, setLastRecommendationUrl } = useEngineStore();

  const handleGoBack = () => window.history.back();

  type ApiRecommendationItem = {
    id: number | string;
    title?: string;
    score?: number;
    why?: string | null;
  };
  type RecommendationsResponse = {
    source_id?: number | string;
    recommendations: ApiRecommendationItem[];
  };

  useEffect(() => {
    // Zapisz URL przy pierwszym renderowaniu
    setLastRecommendationUrl(window.location.pathname + window.location.search);
  }, [setLastRecommendationUrl]);

  useEffect(() => {
    if (!movieId) return;

    const controller = new AbortController();

    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movies: Movie[] = allMovies as Movie[];
        const foundBaseMovie = movies.find(
          (m) => String(m.id) === String(movieId)
        );
        if (!foundBaseMovie) {
          setError("Nie znaleziono filmu o podanym ID.");
          setLoading(false);
          return;
        }
        setBaseMovie(foundBaseMovie);

        // wybór endpointu wg silnika (proxy Next.js eliminuje CORS)
        const endpoint =
          engine === "v1" ? "/api/recommendations_v1" : "/api/recommendations";

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movie_id: Number(foundBaseMovie.id) }),
          cache: "no-store",
          signal: controller.signal,
        });

        setEngineReady(true);

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Recommendation server error. ${txt || ""}`.trim());
        }

        const data = (await res.json()) as RecommendationsResponse;
        const apiIds: number[] = (data.recommendations ?? []).map((r) =>
          Number(r.id)
        );

        const merged: Movie[] = apiIds
          .map(
            (id) =>
              (movies.find((m) => Number(m.id) === id) as Movie) ||
              ({
                id,
                title: String(id),
                poster_path: "",
                overview: "",
                release_date: "",
                vote_average: undefined,
                genres: "", // Use empty string if Movie expects genres: string
              } as Movie)
          )
          .filter((m) => Number(m.id) !== Number(foundBaseMovie.id));

        setRecommendations(merged);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    return () => controller.abort();
  }, [movieId, engine, setEngineReady]); // Dodano setEngineReady do zależności

  return (
    <section className="relative min-h-screen overflow-hidden pb-10 pt-32 ">
      <Container>
        {loading && <Loading message={`Model ${engine.toUpperCase()} is generating your recommendations...`} />}

        {error && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-red-400 text-center text-lg pt-24">{error}</p>
            <h1>Please try again later!</h1>
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-2 w-full max-w-[250px] justify-center bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/20 duration-300"
            >
              <Icon icon="keyboard_backspace" className="!text-2xl" />
              Back
            </button>
          </div>
        )}

        {!loading && !error && baseMovie && (
          <div className="flex flex-col items-center w-full mx-auto">
            <Title
              subtitle={`Generated especially for you • Model: ${engine.toUpperCase()}`}
              gradientLight={{
              from: "from-pink-300",
              via: "via-rose-200",
              to: "to-violet-300",
              subtitleColor: "text-white",
            }}
            gradientDark={{
              from: "from-pink-400",
              via: "via-purple-300",
              to: "to-violet-400",
              subtitleColor: "text-white/80",
            }}
            >
              Movie Recommendations
            </Title>

            <motion.div
              className="mt-4 sm:mt-12 mb-8 w-full max-w-3xl "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold text-white/80 mb-4 text-center">
                Based on movie:
              </h2>
              <Link href={`/movies/${baseMovie.id}`} className="flex flex-col sm:flex-row items-center p-4 sm:p-6 bg-white/7 rounded-2xl border border-white/20 backdrop-blur-lg overflow-hidden group hover:bg-white/10 transition duration-300 cursor-pointer hover:border-white/30">
                <div className="w-full max-w-sm sm:max-w-2xl sm:w-52 flex-shrink-0 rounded-lg overflow-hidden sm:rounded-none">
                  <FadeImage
                    src={`https://image.tmdb.org/t/p/w500${baseMovie.poster_path}`}
                    alt={`Plakat filmu ${baseMovie.title}`}
                    width={500}
                    height={750}
                    className=" transition-transform duration-300"
                  />
                </div>
                <div className="text-center sm:text-left mt-4 sm:ml-6 sm:mt-0">
                  <h3 className="text-2xl font-bold text-white">{baseMovie.title}</h3>
                  <p className="text-md text-white/70">{baseMovie.release_date?.slice(0, 4)}</p>
                  <p className="text-xs text-white/60">{baseMovie.genres}</p>
                  <p className="hidden sm:block text-sm text-white/80 line-clamp-4 mt-0 sm:mt-3">{baseMovie.overview}</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold text-white/80 mb-6 text-center">
                Here are 8 movies you might like:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
                {recommendations.map((movie, index) => (
                  <MovieRankingCard
                    movie={movie}
                    rank={index + 1}
                    key={`${movie.id}-${index}`}
                  />
                ))}
              </div>
            </motion.div>

            <Link
              href="/recommender"
              className="mt-10 px-8 py-3 text-center bg-gradient-to-br from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15 border border-white/30 rounded-lg text-white hover:bg-gradient-to-tr hover:from-indigo-400/35 hover:via-fuchsia-400/45 hover:to-purple-400/55 transition-colors cursor-pointer shadow-lg hover:shadow-xl shadow-violet-500/20"
            >
              Search for other recommendations
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
