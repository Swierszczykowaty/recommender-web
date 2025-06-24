"use client";
import { useParams, notFound } from "next/navigation";
import type { Movie } from "@/types/movie";
import rawMoviesData from "@/data/full_data_web.json";
import Container from "@/components/global/Container";
import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ColorThief from "colorthief";
import { useEffect } from "react";
import AnimatedBackground from "@/components/global/Background";
import { AnimatePresence } from "framer-motion";

const moviesData: Movie[] = rawMoviesData as Movie[];

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const movie = moviesData.find((m) => m.id === movieId);
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, 300], [0, -100]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (!movie?.backdrop_path) return;

    const img = typeof window !== "undefined" ? new window.Image() : null;
    if (!img) return;

    img.crossOrigin = "anonymous";
    img.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5) as [
          number,
          number,
          number
        ][];
        const rgbaColors = palette.map(
          ([r, g, b]: [number, number, number], i: number) =>
            `rgba(${r}, ${g}, ${b}, ${i < 3 ? 0.3 : 0.2})`
        );
        setColors(rgbaColors);
        console.log("🎨 Dominujące kolory:", rgbaColors);
      } catch (err) {
        console.error("❌ Błąd przy wyciąganiu kolorów:", err);
      }
    };
  }, [movie?.backdrop_path]);

  if (!movie) return notFound();

  const getRatingColor = (rating: number | undefined) => {
    if (rating === undefined) return "bg-gray-600";
    if (rating >= 7) return "bg-green-600";
    if (rating >= 5) return "bg-amber-500";
    return "bg-red-600";
  };

  // Dodana funkcja do cofania w historii przeglądarki
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <section className="relative min-h-screen text-white ">
      <AnimatedBackground dynamicColors={colors} />

      {/* Backdrop Image with Gradient or Placeholder */}
      {movie.backdrop_path ? (
        <div className="relative w-full h-[600px] overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: scrollYProgress }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              style={{
                objectPosition: "center 20%",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10" />
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 drop-shadow-2xl -mt-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-lg italic text-white">{movie.tagline}</p>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="relative w-full h-[400px] flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-lg italic text-white ">{movie.tagline}</p>
          )}
          <p className="text-white mt-4">
            No backdrop available for this movie.
          </p>
        </div>
      )}

      {/* Main content */}
      <Container>
        <motion.div
          className="relative z-10 w-full max-w-5xl mx-auto bg-white/10 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl -mt-66"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              {movie.poster_path ? (
                <motion.div
                  className="relative cursor-pointer group"
                  onClick={() => setIsModalOpen(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="rounded-lg object-cover"
                  />
                  {/* Overlay for hover effect */}
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="material-icons text-white text-6xl">
                      zoom_in
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full h-[750px] bg-gray-700 rounded-lg flex items-center justify-center text-white">
                  Brak plakatu
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3 space-y-4 flex flex-col">
              <p className="text-white/80 text-xl font-semibold flex items-center gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow ${getRatingColor(
                    movie.vote_average
                  )}`}
                  title={`${movie.vote_count} głosów`}
                >
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-white/60 text-sm">
                  {movie.vote_count} głosów
                </span>
              </p>
              <p className="text-white/80">{movie.overview}</p>
              <p>
                <strong>Data premiery:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Czas trwania:</strong> {movie.runtime} minut
              </p>
              <p>
                <strong>Gatunki:</strong> {movie.genres}
              </p>
              <p>
                <strong>Kraje produkcji:</strong> {movie.production_countries}
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-8 border-t border-white/20 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
            <p>
              <strong>Budżet:</strong> ${movie.budget?.toLocaleString()}
            </p>
            <p>
              <strong>Przychód:</strong> ${movie.revenue?.toLocaleString()}
            </p>
            <p>
              <strong>Popularność:</strong> {movie.popularity}
            </p>
            <p>
              <strong>Języki:</strong> {movie.spoken_languages}
            </p>
            <p className="sm:col-span-2">
              <strong>Studia produkcyjne:</strong> {movie.production_companies}
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="my-10 text-center cursor-pointer">
          {/* Zmieniono Link na button i dodano onClick */}
          <button
            onClick={handleGoBack}
            className="inline-block px-6 py-5 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition cursor-pointer"
          >
            ← Powrót do poprzedniej strony
          </button>
        </div>
      </Container>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-[90%] mt-[68px]"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                width={1000}
                height={1500}
                className="rounded-lg object-contain max-h-[60vh] sm:max-h-[80vh] mx-auto"
              />
              <div className="text-center text-white mt-4">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-sm text-white/70">
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-[-50] sm:top-0 right-0 bg-white/10 border border-white/30 text-white px-4 py-2 rounded hover:bg-white/20"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
