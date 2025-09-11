"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { Movie } from "@/types/movie";
import rawMoviesData from "@/data/full_data_web.json";
import Container from "@/components/layout/Container";
import AnimatedBackground from "@/components/layout/Background";
import Icon from "@/components/global/Icon";
import FadeImage from "@/components/global/FadeImage";

// Lekkie opóźnienie daje naturalny efekt "wczytywania" 350?
const SKELETON_MIN_MS = 0;

// Lazy-load cięższe komponenty, żeby strona pojawiła się natychmiast
const MovieModal = dynamic(() => import("@/components/movies/MovieModal"), {
  ssr: false,
  loading: () => null,
});
const MobileScrollFAB = dynamic(
  () => import("@/components/movies/MobileScrollFAB"),
  { ssr: false, loading: () => null }
);

const moviesData: Movie[] = rawMoviesData as Movie[];

// Prosty, elegancki skeleton
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 border border-white/20 rounded-lg ${className}`} />
  );
}

export default function MovieDetailPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = Number(params.id);
  const movie = useMemo(() => moviesData.find((m) => m.id === movieId), [movieId]);

  // Parallax dla backdropu
  const { scrollY } = useScroll();
  const backdropY = useTransform<number, number>(scrollY, [0, 300], [0, -100]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Minimalny, kontrolowany skeleton + pobranie kolorów po stronie klienta
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => !cancelled && setLoading(false), SKELETON_MIN_MS);

    // Dynamiczny import ColorThief tylko na kliencie
    (async () => {
      if (!movie?.backdrop_path) return;
      try {
        const { default: ColorThief } = await import("colorthief");
        const img = typeof window !== "undefined" ? new window.Image() : null;
        if (!img) return;
        img.crossOrigin = "anonymous";
        img.src = `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`;
        img.onload = () => {
          try {
            const palette = new ColorThief().getPalette(img, 5) as [number, number, number][];
            if (!cancelled) {
              setColors(
                palette.map(([r, g, b], i) => `rgba(${r},${g},${b},${i < 3 ? 0.3 : 0.2})`)
              );
            }
          } catch (err) {
            console.error("❌ Błąd przy wyciąganiu kolorów:", err);
          }
        };
      } catch (e) {
        console.warn("ColorThief lazy import failed", e);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [movie?.backdrop_path]);

  if (!movie) return notFound();

  const getRatingColor = (rating?: number) => {
    if (rating === undefined) return "bg-gray-600";
    if (rating >= 7) return "bg-green-700";
    if (rating >= 5) return "bg-amber-500";
    return "bg-red-600";
  };

  const handleGoBack = () => window.history.back();

  const platformLogos = [
    { flag: movie.on_netflix, alt: "Netflix", src: "/Company/Netflix.png", url: "https://www.netflix.com" },
    { flag: movie.on_apple_tv, alt: "Apple TV+", src: "/Company/Apple-TV.png", url: "https://tv.apple.com" },
    { flag: movie.on_hulu, alt: "Hulu", src: "/Company/Hulu.png", url: "https://www.hulu.com" },
    { flag: movie.on_hbo_max, alt: "HBO Max", src: "/Company/Max.png", url: "https://www.hbomax.com" },
    { flag: movie.on_amazon_prime, alt: "Amazon Prime", src: "/Company/Amazon-Prime.png", url: "https://www.primevideo.com" },
  ];
  const hasPlatforms = platformLogos.some((p) => p.flag);

  return (
    <section className="relative min-h-screen text-white">
      <AnimatedBackground dynamicColors={colors} />

      {/* Backdrop z parallax (z lekkim szkieletem dla tytułu) */}
      {movie.backdrop_path ? (
        <div className="relative w-full h-[400px] sm:h-[800px] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: backdropY }}>
            <FadeImage
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              style={{
                objectPosition: "center 20%",
                WebkitMaskImage: "linear-gradient(to bottom, black 25%, transparent)",
                maskImage: "linear-gradient(to bottom, black 25%, transparent)",
              }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-center drop-shadow-2xl -mt-[0px] sm:-mt-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.title}</h1>
            {movie.tagline && (
              <p className="px-8 md:px-10 mx-auto max-w-6xl text-lg italic">{movie.tagline}</p>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="relative w-full h-[400px] sm:h-[800px]">
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-center drop-shadow-2xl -mt-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {loading ? (
              <Skeleton className="w-64 h-10" />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.title}</h1>
            )}
            {movie.tagline && !loading && (
              <p className="flex px-8 mx-auto text-lg italic">{movie.tagline}</p>
            )}
          </motion.div>
        </div>
      )}

      <Container>
        <div className="grid grid-cols-1 gap-6 -mt-[100px] sm:-mt-[500px]">
          {/* Górny pasek: breadcrumb + powrót */}
          <motion.div
            className="flex justify-between items-center -mb-2 z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-xs md:text-sm text-white/70 mt-2">
                <li>
                  <Link href="/movies" className="hover:underline">
                    Baza Filmów
                  </Link>
                </li>
                <li><span>/</span></li>
                <li className="text-white font-medium">{movie.title}</li>
              </ol>
            </nav>
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-1 text-sm bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/10 duration-300"
            >
              <Icon icon="keyboard_backspace" style={{ fontSize: "20px" }} />
              <span className="text-sm hidden md:inline">Powrót</span>
            </button>
          </motion.div>

          {/* Główny kafelek: poster + opis (z widokiem skeleton) */}
          <motion.div
            className="bg-white/7 border border-white/20 p-6 md:p-8 rounded-xl backdrop-blur-md shadow-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {loading ? (
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="w-full md:w-1/3 h-[420px] sm:h-[356px] xl:h-[490px] " />
                <div className="w-full md:w-2/3 flex flex-col gap-4">
                  <Skeleton className="w-24 h-9 rounded-full" />
                  <Skeleton className="w-full h-24" />
                  <Skeleton className="w-1/2 h-5" />
                  <Skeleton className="w-1/3 h-5" />
                  <Skeleton className="w-2/3 h-5" />

                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Poster */}
                <div className="w-full md:w-1/3">
                  {movie.poster_path ? (
                    <div
                      className="relative flex cursor-pointer group max-w-[440px] md:max-w-3xl"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FadeImage
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="rounded-lg object-cover w-full"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Icon icon="zoom_in" className="!text-3xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-[750px] bg-gray-700 rounded-lg flex items-center justify-center">
                      Brak plakatu
                    </div>
                  )}
                </div>

                {/* Opis */}
                <div className="w-full md:w-2/3 flex flex-col">
                  <p className="flex items-center gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold shadow ${getRatingColor(
                        movie.vote_average
                      )}`}
                      title={`${movie.vote_count} głosów`}
                    >
                      ★ {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-white/60 text-sm">{movie.vote_count} głosów</span>
                  </p>

                  <div className="space-y-4">
                    <p className="text-white/80 mt-4 text-sm md:text-md">{movie.overview}</p>
                    <p className="text-sm md:text-md">
                      <strong>Reżyser:</strong>{" "}
                      {typeof movie.directors === "string" && movie.directors
                        ? movie.directors.split(",").map((dir, i, arr) => (
                            <span
                              key={i}
                              className="cursor-pointer hover:underline text-sm md:text-md"
                              onClick={() =>
                                router.push(`/movies?query=${encodeURIComponent(dir.trim())}&page=1`)
                              }
                            >
                              {dir.trim()}
                              {i < arr.length - 1 ? ", " : ""}
                            </span>
                          ))
                        : "brak danych"}
                    </p>
                    <p className="text-sm md:text-md"><strong>Data premiery:</strong> {movie.release_date}</p>
                    <p className="text-sm md:text-md"><strong>Czas trwania:</strong> {movie.runtime} min</p>
                    <p className="mb-4 text-sm md:text-md"><strong>Gatunki:</strong> {movie.genres}</p>
                  </div>

                  {/* Platformy */}
                  {hasPlatforms && (
                    <div className="mt-auto flex flex-col">
                      <h3 className="text-white font-semibold mb-4 text-sm md:text-md">
                        {movie.title} – gdzie zobaczyć?
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-none md:flex md:flex-row gap-4 justify-center md:justify-start w-full">
                        {platformLogos.map(({ flag, alt, src, url }) =>
                          flag ? (
                            <a
                              key={alt}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full md:w-[30%] lg:w-[20%]"
                              title={alt}
                            >
                              <div className="relative h-10 bg-white/25 hover:bg-white/35 duration-300 cursor-pointer border border-white/20 rounded-lg shadow-md overflow-hidden w-full">
                                <Image src={src} alt={alt} fill className="object-contain p-1" />
                              </div>
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Obsada */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <h2 className="mb-2 font-semibold">Obsada:</h2>
            {loading ? (
              <div className="bg-white/7 border border-white/20 p-6 md:p-8 rounded-xl backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="bg-white/7 border border-white/20 p-6 md:p-8 rounded-xl backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(movie.actors) &&
                  movie.actors.slice(0, 9).map((actor, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        router.push(`/movies?query=${encodeURIComponent(actor.name)}&page=1`)
                      }
                      className="group shadow-md flex flex-row items-center relative bg-white/7 px-3 py-2 rounded-lg border border-white/20 cursor-pointer hover:bg-white/7 duration-300"
                    >
                      <span className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 36, height: 36 }}>
                        <Icon icon="person" className="!text-3xl absolute left-0 top-0 opacity-100 group-hover:opacity-0 group-hover:scale-50 duration-300" />
                        <Icon icon="data_loss_prevention" className="!text-3xl absolute left-0 top-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-50 duration-300" />
                      </span>
                      <div className="flex flex-col items-start justify-center pl-1 md:pl-2">
                        <span className="text-sm font-semibold">{actor.name}</span>
                        <span className="text-xs text-white/70 italic mt-[1px] md:mt-[2px]">jako: {actor.character || "brak danych"}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>

          {/* Informacje dodatkowe */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <h2 className="mb-2 font-semibold">Informacje:</h2>
            {loading ? (
              <div className="bg-white/7 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6" />
                ))}
                <Skeleton className="sm:col-span-2 h-6" />
                <Skeleton className="sm:col-span-2 h-6" />
              </div>
            ) : (
              <div className="bg-white/7 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                {typeof movie.budget === "number" && movie.budget > 0 && (
                  <p className="text-sm md:text-md"><strong>Budżet:</strong> ${movie.budget.toLocaleString()}</p>
                )}
                {typeof movie.revenue === "number" && movie.revenue > 0 && (
                  <p className="text-sm md:text-md"><strong>Przychód:</strong> ${movie.revenue.toLocaleString()}</p>
                )}
                <p className="text-sm md:text-md"><strong>Popularność:</strong> {movie.popularity}</p>
                <p className="text-sm md:text-md"><strong>Języki:</strong> {movie.spoken_languages}</p>
                <p className="sm:col-span-2 text-sm md:text-md"><strong>Kraje produkcji:</strong> {movie.production_countries}</p>
                <p className="sm:col-span-2 text-sm md:text-md"><strong>Studia produkcyjne:</strong> {movie.production_companies}</p>
              </div>
            )}
          </motion.div>

          {/* Przyciski na końcu karty */}
          <div className="mb-10 flex flex-col-reverse md:flex-row justify-center items-center gap-4 mt-2">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 w-full max-w-[250px] justify-center bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/7 duration-300"
            >
              <Icon icon="keyboard_backspace" style={{ fontSize: "20px" }} />
              Powrót
            </button>
            {!loading && (
              <Link
                href={`/recommender/${movie.id}`}
                className="z-40 flex px-6 py-3 w-full max-w-[250px] justify-center shadow-xl bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15 border border-white/30 rounded-lg hover:from-indigo-400/35 hover:via-fuchsia-400/45 hover:to-purple-400/55 transition-colors duration-300"
              >
                Generuj Rekomendacje
              </Link>
            )}
          </div>
        </div>
      </Container>

      {/* Modal z plakatem */}
      <MovieModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movie={movie} />

      {/* FAB: tylko mobile, pojawia się po lekkim scrollu, znika przy dole */}
      {!loading && (
        <MobileScrollFAB
          href={`/recommender/${movie.id}`}
          label="Generuj rekomendacje"
          icon="app_registration"
          appearAfterPx={80}
          hideAtBottomPercent={0.9}
        />
      )}
    </section>
  );
}
