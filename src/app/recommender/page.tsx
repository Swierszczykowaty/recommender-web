'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importujemy useRouter
import Title from '@/components/global/Title';
import Container from '@/components/global/Container';
import SmallMovieCard from '@/components/movies/MovieCardSmall';
import SearchBar from '@/components/global/SearchBar';
import type { Movie } from '@/types/movie';
import allMovies from '@/data/full_data_web.json';
import { filterMovies } from '@/lib/filterMovies';

const movies: Movie[] = allMovies as Movie[];

export default function RecommenderSearchPage() { // Zmieniona nazwa dla jasności
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter(); // Inicjalizacja routera

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filterMovies(movies, query);
    setSearchResults(filtered.slice(0, 10));
  };

  // Funkcja, która będzie przekierowywać do strony z rekomendacjami
  const handleMovieSelect = (movie: Movie) => {
    router.push(`/recommender/${movie.id}`);
  };

  // Efekt do ładowania popularnych filmów na start
  useEffect(() => {
    if (searchQuery === '' && searchResults.length === 0) {
      const filtered = movies
        .filter((m) => !!m.poster_path && m.vote_average && m.vote_average > 7.0 && m.popularity && m.popularity > 80.0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      setSearchResults(filtered);
    }
  }, [searchQuery, searchResults.length]);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden pt-32 ">
      <Container>
        <div className="flex flex-col items-center w-full mx-auto mb-20">
          <Title subtitle='Wybierz film, a my znajdziemy podobne' gradientFrom="from-indigo-400" gradientVia="via-fuchsia-400" gradientTo="to-purple-400">
            Generowanie Rekomendacji
          </Title>
          <div className="mt-8 w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="Wpisz tytuł filmu..." />
          </div>
          {searchResults.length > 0 && (
            <>
              <h2 className="text-white/80 text-sm mt-2">
                {searchQuery ? `Wyniki dla: "${searchQuery}"` : 'Ostatnio popularne:'}
              </h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
                {searchResults.map((movie) => (
                  // Po kliknięciu wywołujemy handleMovieSelect
                  <div key={movie.id} onClick={() => handleMovieSelect(movie)} className="cursor-pointer">
                    <SmallMovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}