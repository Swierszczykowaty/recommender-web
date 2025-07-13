"use client";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/types/movie";
import rawMoviesData from "@/data/full_data_web.json";
import Container from "@/components/global/Container";
import AnimatedBackground from "@/components/global/Background";
import MovieModal from "@/components/movies/MovieModal";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ColorThief from "colorthief";
import Icon from "@/components/global/Icon";
import { useRouter } from "next/navigation";

const moviesData: Movie[] = rawMoviesData as Movie[];

export default function MovieDetailPage() {
  const router = useRouter();
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
    img.src = `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`;
    img.onload = () => {
      try {
        const palette = new ColorThief().getPalette(img, 5) as [
          number,
          number,
          number
        ][];
        setColors(
          palette.map(
            ([r, g, b], i) => `rgba(${r},${g},${b},${i < 3 ? 0.3 : 0.2})`
          )
        );
      } catch (err) {
        console.error("❌ Błąd przy wyciąganiu kolorów:", err);
      }
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

  // Tablica z dostawcami + ścieżkami do logo
  const platformLogos = [
    // { flag: movie.on_netflix, alt: "Netflix", src: "/Company/netflix_w.png" },
    // { flag: movie.on_apple_tv, alt: "Apple TV+", src: "/Company/Apple-TV_w.png" },
    // { flag: movie.on_hulu, alt: "Hulu", src: "/Company/hulu_w.png" },
    // { flag: movie.on_hbo_max, alt: "HBO Max", src: "/Company/max_w.png" },
    // { flag: movie.on_amazon_prime, alt: "Amazon Prime", src: "/Company/Amazon-Prime_w.png" }
    {
      flag: movie.on_netflix,
      alt: "Netflix",
      src: "/Company/Netflix.png",
      url: "https://www.netflix.com",
    },
    {
      flag: movie.on_apple_tv,
      alt: "Apple TV+",
      src: "/Company/Apple-TV.png",
      url: "https://tv.apple.com",
    },
    {
      flag: movie.on_hulu,
      alt: "Hulu",
      src: "/Company/Hulu.png",
      url: "https://www.hulu.com",
    },
    {
      flag: movie.on_hbo_max,
      alt: "HBO Max",
      src: "/Company/Max.png",
      url: "https://www.hbomax.com",
    },
    {
      flag: movie.on_amazon_prime,
      alt: "Amazon Prime",
      src: "/Company/Amazon-Prime.png",
      url: "https://www.primevideo.com",
    },
  ];
  // w środku MovieDetailPage, przed return:
  const hasPlatforms = platformLogos.some((p) => p.flag);
  const fabVariants = {
    collapsed: { width: 56 },
    expanded: { width: 250 },
  };
  const textVariants = {
    collapsed: { opacity: 0, x: -10 },
    expanded: { opacity: 1, x: 0 },
  };

  return (
    <section className="relative min-h-screen text-white">
      <AnimatedBackground dynamicColors={colors} />

      {/* Backdrop z parallax */}
      {movie.backdrop_path ? (
        <div className="relative w-full h-[800px] overflow-hidden">
          <motion.div
            className="absolute inset-0 "
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
                  "linear-gradient(to bottom, black 25%, transparent)",
                maskImage: "linear-gradient(to bottom, black 25%, transparent)",
              }}
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-center drop-shadow-2xl -mt-[400px] "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {movie.title}
            </h1>
            {movie.tagline && <p className="text-lg italic">{movie.tagline}</p>}
          </motion.div>
        </div>
      ) : null}

      <Container>
        <div className="grid grid-cols-1 gap-8 -mt-[500px]">
          {/* 1) Główny kafelek z posterem i opisem */}
          <div className="z-50">
            <motion.div
              className="flex justify-between items-center mb-4 z-50"
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
                  <li>
                    <span>/</span>
                  </li>
                  <li className="text-white font-medium">{movie.title}</li>
                </ol>
              </nav>
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-1 text-sm bg-white/10 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/20"
              >
                <Icon icon="keyboard_backspace" style={{ fontSize: "20px" }} />
                <span className="text-sm hidden md:inline">Powrót</span>
              </button>
            </motion.div>
            {/* głowny kafelek */}
            <motion.div
              className="bg-white/10 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Poster */}
                <div className="w-full md:w-1/3">
                  {movie.poster_path ? (
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        width={500}
                        height={750}
                        // width={400}
                        // height={600}
                        className="rounded-lg object-cover w-full max-w-3xl"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Icon icon="zoom_in" style={{ fontSize: "30px" }} />
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
                    <span className="text-white/60 text-sm">
                      {movie.vote_count} głosów
                    </span>
                  </p>
                  <div className="space-y-4">
                    <p className="text-white/80 mt-4">{movie.overview}</p>
                    <p>
                      <strong>Reżyser:</strong> {movie.directors}
                    </p>
                    <p>
                      <strong>Data premiery:</strong> {movie.release_date}
                    </p>
                    <p>
                      <strong>Czas trwania:</strong> {movie.runtime} min
                    </p>
                    <p className="mb-4">
                      <strong>Gatunki:</strong> {movie.genres}
                    </p>
                  </div>
                  {/* 2) Badges platform */}
                  {hasPlatforms && (
                    <div className="mt-auto flex flex-col">
                      <h3 className="text-white font-semibold mb-4">
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
                              className="block w-full md:w-[30%] lg:w-[20%]" // responsywne szerokości
                            >
                              <div className="relative h-10 bg-white/25 hover:bg-white/35 duration-300 cursor-pointer border border-white/20 rounded-lg shadow-md overflow-hidden w-full">
                                <Image
                                  src={src}
                                  alt={alt}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          {/* Aktorzy */}
          <motion.div
            className=""
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <h2 className="mb-2 font-semibold">Obsada:</h2>
            <div className="bg-white/10 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
              {movie.actors
                ?.split(",")
                .map((actor) => actor.trim())
                .filter(Boolean)
                .map((actor, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      router.push(
                        `/movies?query=${encodeURIComponent(actor)}&page=1`
                      )
                    }
                    className="group flex relative items-center gap-2 text-white/90 bg-white/10 px-3 py-2 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 duration-300"
                  >
                    <Icon
                      icon="person"
                      className="absolute opacity-100 group-hover:opacity-0 group-hover:scale-50 duration-300"
                    />
                    <Icon
                      icon="data_loss_prevention"
                      className="absolute opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-50 duration-300"
                    />
                    <span className="text-sm ml-8">{actor}</span>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* 3) Kafelek z budżetem, przychodem itd. */}
          <motion.div
            className=""
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <h2 className="mb-2 font-semibold">Informacje:</h2>

            <div className="bg-white/10 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {typeof movie.budget === "number" && movie.budget > 0 && (
                <p>
                  <strong>Budżet:</strong> ${movie.budget.toLocaleString()}
                </p>
              )}
              {typeof movie.revenue === "number" && movie.revenue > 0 && (
                <p>
                  <strong>Przychód:</strong> ${movie.revenue.toLocaleString()}
                </p>
              )}
              <p>
                <strong>Popularność:</strong> {movie.popularity}
              </p>
              <p>
                <strong>Języki:</strong> {movie.spoken_languages}
              </p>
              <p className="sm:col-span-2">
                <strong>Kraje produkcji:</strong> {movie.production_countries}
              </p>
              <p className="sm:col-span-2">
                <strong>Studia produkcyjne:</strong>{" "}
                {movie.production_companies}
              </p>
            </div>
          </motion.div>

          {/* przyciski */}
          <div className="mb-10 flex flex-col-reverse md:flex-row justify-center items-center gap-4 mt-2">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 w-full max-w-[250px] justify-center bg-white/10 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/20 duration-300"
            >
              <Icon icon="keyboard_backspace" style={{ fontSize: "20px" }} />
              Powrót
            </button>
            <Link
              href={`/recommender/${movie.id}`}
              className="flex px-6 py-3 w-full max-w-[250px]  justify-center bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15 border border-white/30 rounded-lg hover:from-indigo-400/35 hover:via-fuchsia-400/45 hover:to-purple-400/55 transition-colors duration-300"
            >
              Generuj Rekomendacje
            </Link>
          </div>
        </div>
      </Container>

      {/* Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={movie}
      />

      <motion.div className="fixed mb-4 xl:mb-0 xl:mr-0 bottom-6 mr-4 right-4 md:right-6 z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}>
        <Link href={`/recommender/${movie.id}`} className="block">
          <motion.div
            className="relative flex backdrop-blur-lg items-center h-14 bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15 border border-white/30 rounded-2xl overflow-hidden cursor-pointer"
            initial="collapsed"
            whileHover="expanded"
            variants={fabVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* ikona zawsze widoczna */}
            <Icon
              icon="app_registration"
              className="text-white z-10 ml-[14px]"
              style={{ fontSize: 24 }}
            />

            {/* tekst absolutnie po lewej, animowany */}
            <motion.span
              className="absolute left-14 text-white font-medium whitespace-nowrap"
              variants={textVariants}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Generuj rekomendacje
            </motion.span>
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
