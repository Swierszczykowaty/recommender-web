'use client';

import { useParams, notFound } from 'next/navigation';
import type { Movie } from '@/types/movie';
import rawMoviesData from '@/data/full_data_web.json';
import Container from '@/components/Container';
import Image from 'next/image';
import Link from 'next/link';

const moviesData: Movie[] = rawMoviesData as Movie[];

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const movie = moviesData.find((m) => m.id === movieId);

  if (!movie) return notFound();

  return (
    <section className="relative min-h-screen text-white">
      {/* Backdrop Image with Gradient */}
      {movie.backdrop_path && (
        <div className="relative w-full h-[400px]">
        <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            style={{
            objectPosition: 'center 20%',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
            }}
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 drop-shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 ">{movie.title}</h1>
            {movie.tagline && (
            <p className="text-lg italic text-white">{movie.tagline}</p>
            )}
        </div>
        </div>
      )}

      {/* Main content */}
      <Container>
        <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/10 border border-white/20 p-8 rounded-xl backdrop-blur-md shadow-xl -mt-24">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-[750px] bg-gray-700 rounded-lg flex items-center justify-center text-white">
                  Brak plakatu
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3 space-y-4 flex flex-col">
              <p className="text-white/80">{movie.overview}</p>
              <p><strong>Data premiery:</strong> {movie.release_date}</p>
              <p><strong>Czas trwania:</strong> {movie.runtime} minut</p>
              <p><strong>Ocena:</strong> {movie.vote_average} ({movie.vote_count} głosów)</p>
              <p><strong>Język oryginalny:</strong> {movie.original_language}</p>
              <p><strong>Gatunki:</strong> {movie.genres}</p>
              <p><strong>Kraje produkcji:</strong> {movie.production_countries}</p>
                {/* Back Button */}
                <div className="mt-auto text-center">
                    <Link
                    href="/movies"
                    className="inline-block px-6 py-3 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition"
                    >
                    ← Powrót do bazy filmów
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
