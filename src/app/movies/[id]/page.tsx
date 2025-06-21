'use client';

import { useParams } from 'next/navigation';
import type { Movie } from '@/types/movie'; 
import rawMoviesData from '@/data/full_data_web.json';
import Container from '@/components/Container';
import Title from '@/components/Title';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const moviesData: Movie[] = rawMoviesData as Movie[]; 

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const movie = moviesData.find((m) => m.id === movieId);

  if (!movie) return notFound();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-16">
      <Container>
        <div className="relative z-10 w-full max-w-4xl mx-auto backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-xl text-white shadow-xl">
          <Title subtitle={movie.tagline}>{movie.title}</Title>
          <div className="mt-6 flex flex-col md:flex-row gap-6">
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
            <div className="w-full md:w-2/3 space-y-4">
              <p className="text-white/80">{movie.overview}</p>
              <p><strong>Data premiery:</strong> {movie.release_date}</p>
              <p><strong>Czas trwania:</strong> {movie.runtime} minut</p>
              <p><strong>Ocena:</strong> {movie.vote_average} ({movie.vote_count} głosów)</p>
              <p><strong>Język oryginalny:</strong> {movie.original_language}</p>
              <p><strong>Gatunki:</strong> {movie.genres}</p>
              <p><strong>Kraje produkcji:</strong> {movie.production_countries}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
