'use client';

import Title from '@/components/Title';
import Container from '@/components/Container';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';
import moviesDataRaw from '@/data/full_data_web.json';
import { useState } from 'react';

const moviesData: Movie[] = moviesDataRaw as Movie[];

export default function MoviesPage() {
  const [visibleMovies, setVisibleMovies] = useState(25);

  const handleLoadMore = () => {
    setVisibleMovies((prev) => prev + 25);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-32">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title>Baza filmów</Title>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {moviesData.slice(0, visibleMovies).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {visibleMovies < moviesData.length && (
            <button
              onClick={handleLoadMore}
              className="mt-10 px-6 py-3 text-white bg-white/10 border border-white/30 rounded-lg backdrop-blur-md hover:bg-white/20 transition"
            >
              Załaduj więcej
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
