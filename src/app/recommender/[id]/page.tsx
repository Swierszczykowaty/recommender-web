"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import type { Movie } from "@/types/movie";
import allMovies from "@/data/full_data_web.json";
import { motion } from "framer-motion";
import Loading from "@/components/global/Loading";
import Icon from "@/components/global/Icon";
import MovieRankingCard from "@/components/rankings/MovieRankingCard";
import FadeImage from "@/components/global/FadeImage";
import { useEngineStore } from "@/lib/engineStore";
import RecommenderCard from "@/components/recommender/RecommenderCard";
import { useBackgroundStore } from "@/lib/backgroundStore";
import ColorThief from "colorthief";

type Engine = "v1" | "v2" | "gemini";

const ENGINE_ENDPOINT: Record<Engine, string> = {
  v1: "/api/recommendations_v1",
  v2: "/api/recommendations_v2",
  gemini: "/api/recommendations_gemini",
};

const ENGINE_LABEL: Record<Engine, string> = {
  v1: "V1",
  v2: "V2",
  gemini: "Gemini",
};

type MovieWithReason = Movie & {
  why?: string | null;
};

export default function RecommendationResultPage() {
  const [baseMovie, setBaseMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<MovieWithReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<Engine>("v2");
  const [hasGenerated, setHasGenerated] = useState(false);

  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  const { setEngineReady, setLastRecommendationUrl } = useEngineStore();
  const setDynamicColors = useBackgroundStore((state) => state.setDynamicColors);

  const handleGoBack = () => {
    setDynamicColors(null); // Reset colors when going back
    router.push("/recommender");
  };

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

  // Załaduj dane filmu
  useEffect(() => {
    if (!movieId) return;

    const movies: Movie[] = allMovies as Movie[];
    const foundBaseMovie = movies.find(
      (m) => String(m.id) === String(movieId)
    );
    
    if (!foundBaseMovie) {
      setError("Nie znaleziono filmu o podanym ID.");
      return;
    }
    
    setBaseMovie(foundBaseMovie);

    // Extract colors from poster
    if (foundBaseMovie.poster_path) {
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = `https://image.tmdb.org/t/p/w200${foundBaseMovie.poster_path}`;
      
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 5);
          
          if (palette && palette.length >= 5) {
            const colors = palette.map(([r, g, b]: number[]) => 
              `rgba(${r}, ${g}, ${b}, 0.28)`
            );
            setDynamicColors(colors);
          }
        } catch (err) {
          console.error("Failed to extract colors:", err);
        }
      };
    }
  }, [movieId, setDynamicColors]);

  // Funkcja generowania rekomendacji
  const handleGenerateRecommendations = async () => {
    if (!baseMovie) return;

    setLoading(true);
    setError(null);
    setHasGenerated(true);

    const controller = new AbortController();

    try {
      const endpoint = ENGINE_ENDPOINT[selectedEngine];

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id: Number(baseMovie.id) }),
        cache: "no-store",
        signal: controller.signal,
      });

      setEngineReady(true);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Recommendation server error. ${txt || ""}`.trim());
      }

      const data = (await res.json()) as RecommendationsResponse;

      const movies: Movie[] = allMovies as Movie[];
      const merged: MovieWithReason[] = (data.recommendations ?? [])
        .map((rec) => {
          const id = Number(rec.id);
          const movie = movies.find((m) => Number(m.id) === id);
          
          if (!movie) {
            return {
              id,
              title: String(id),
              poster_path: "",
              overview: "",
              release_date: "",
              vote_average: undefined,
              genres: "",
              why: rec.why ?? null,
            } as MovieWithReason;
          }

          return {
            ...movie,
            why: rec.why ?? null,
          } as MovieWithReason;
        })
        .filter((m) => Number(m.id) !== Number(baseMovie.id));

      setRecommendations(merged);
      setLastRecommendationUrl(window.location.pathname + `?engine=${selectedEngine}`);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cleanup: reset colors when leaving the page
  useEffect(() => {
    return () => {
      setDynamicColors(null);
    };
  }, [setDynamicColors]);

  return (
    <section className="relative min-h-screen overflow-hidden pb-10 pt-32 ">
      <Container>
        {loading && <Loading message={`Model ${ENGINE_LABEL[selectedEngine]} is generating your recommendations...`} />}

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

        {!loading && !error && baseMovie && !hasGenerated && (
          <div className="flex flex-col items-center w-full mx-auto relative">
            <motion.div
              className="mb-4 w-full max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-end justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-white/80">
                  Your selected movie:
                </h2>
                <button
                  onClick={handleGoBack}
              className="flex items-center gap-2 px-2 md:px-4 py-1 text-sm bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/10 duration-300"
                >
                  <Icon icon="keyboard_backspace" className="!text-base md:!text-lg" />
                  Back to search
                </button>
              </div>
              <RecommenderCard movie={baseMovie} onClick={() => {}} />
            </motion.div>

            <motion.div
              className="w-full max-w-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              <h2 className="text-base md:text-xl font-bold text-white mb-6 text-center">
                Choose Recommendation Model:
              </h2>

              <div className="grid grid-cols-1 gap-4 mb-8">
                {/* Model V1 */}
                <button
                  onClick={() => setSelectedEngine("v1")}
                  className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer text-left
                    ${
                      selectedEngine === "v1"
                        ? "bg-white/20 border-white/50 shadow-lg"
                        : "bg-white/7 border-white/30 hover:bg-white/10 hover:border-white/40"
                    }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedEngine === "v1" ? "border-white" : "border-white/50"
                    }`}>
                      {selectedEngine === "v1" && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white">Model v1.0 - Classic</h3>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 ml-8">
                    Dense vector embeddings with KNN search. Fast and reliable recommendations based on semantic similarity.
                  </p>
                </button>

                {/* Model V2 */}
                <button
                  onClick={() => setSelectedEngine("v2")}
                  className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer text-left
                    ${
                      selectedEngine === "v2"
                        ? "bg-white/20 border-white/50 shadow-lg"
                        : "bg-white/7 border-white/30 hover:bg-white/10 hover:border-white/40"
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      selectedEngine === "v2" ? "border-white" : "border-white/50"
                    }`}>
                      {selectedEngine === "v2" && (
                        <div className="w-3 h-3 rounded-full bg-white "></div>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white mr-3">Model v2.0 - Hybrid</h3>
                    <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 rounded-full text-white">
                      <span className="hidden sm:inline">Recommended</span>
                      <span className="sm:hidden">★</span>
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 ml-8">
                    Combines dense embeddings with BM25 keyword matching. More accurate results by balancing semantic and lexical similarity.
                  </p>
                </button>

                {/* Model Gemini */}
                <button
                  onClick={() => setSelectedEngine("gemini")}
                  className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer text-left relative overflow-hidden group
                    ${
                      selectedEngine === "gemini"
                        ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/50 shadow-lg"
                        : "bg-white/7 border-white/30 hover:bg-white/10 hover:border-white/40"
                    }`}
                >
                  {selectedEngine === "gemini" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <div className="flex items-center mb-2 relative z-10">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedEngine === "gemini" ? "border-white" : "border-white/50"
                    }`}>
                      {selectedEngine === "gemini" && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <Image
                      src="/gemini-color.png"
                      alt="Gemini logo"
                      width={24}
                      height={24}
                      className="w-6 h-6 ml-3 mr-1"
                    />
                    <h3 className="text-base md:text-lg font-bold text-white">Gemini AI</h3>
                    <span className="ml-3 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-full text-white">
                      Beta
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 ml-8 relative z-10">
                    Powered by Google Gemini AI. Advanced contextual understanding and creative recommendations. <a href="/about#gemini" className="underline hover:text-white transition-colors">Read more</a>
                  </p>
                </button>
              </div>

              <button
                onClick={handleGenerateRecommendations}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold bg-gradient-to-br from-pink-500/20 via-purple-500/30 to-violet-500/20 border border-white/30 rounded-xl text-white hover:from-pink-500/30 hover:via-purple-500/40 hover:to-violet-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl shadow-violet-500/20"
              >
                <Icon icon="auto_awesome" className="!text-lg md:!text-2xl" />
                Generate Recommendations
              </button>
            </motion.div>
          </div>
        )}

        {!loading && !error && baseMovie && hasGenerated && recommendations.length > 0 && (
          <div className="flex flex-col items-center w-full mx-auto">
            <motion.div
              className="mb-8 w-full max-w-3xl "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-end justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-white/80">
                  Based on movie:
                </h2>
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-2 md:px-4 py-1 text-sm bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/10 duration-300"
                >
                  <Icon icon="keyboard_backspace" className="!text-base md:!text-lg" />
                  Back to search
                </button>
              </div>
              <Link
                href={`/movies/${baseMovie.id}`}
                className="flex flex-col sm:flex-row items-center p-4 sm:p-6 bg-white/7 rounded-2xl border border-white/20 backdrop-blur-lg overflow-hidden group hover:bg-white/10 transition duration-300 cursor-pointer hover:border-white/30"
              >
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
                  <h3 className="text-2xl font-bold text-white">
                    {baseMovie.title}
                  </h3>
                  <p className="text-md text-white/70">
                    {baseMovie.release_date?.slice(0, 4)}
                  </p>
                  <p className="text-xs text-white/60">{baseMovie.genres}</p>
                  <p className="hidden sm:block text-sm text-white/80 line-clamp-4 mt-0 sm:mt-3">
                    {baseMovie.overview}
                  </p>
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
                    why={selectedEngine === "gemini" ? movie.why : undefined}
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
