'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import Title from '@/components/Title';
import Container from '@/components/global/Container';
import MovieCard from '@/components/MovieCard';
import SmallMovieCard from '@/components/SmallMovieCard';
import SearchBar from '@/components/SearchBar';
import type { Movie } from '@/types/movie';
import allMovies from '@/data/full_data_web.json';
import { filterMovies } from '@/lib/filterMovies';

interface Recommendation {
  id: number;
  title: string;
}

const movies: Movie[] = allMovies as Movie[];

export default function RecommenderPage() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query); // nowy kod
const filtered = filterMovies(movies, query);

    setSearchResults(filtered.slice(0, 10));
    setSelectedMovie(null);
    setRecommendations([]);
  };

  const fetchRecommendations = async (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setRecommendations([]);

    const res = await fetch('http://127.0.0.1:8000/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_id: movie.id }),
    });

    const data = await res.json();

    const matched = movies.filter((m) =>
      data.recommendations.some((r: Recommendation) => r.id === m.id)
    );

    setRecommendations(matched);
  };

useEffect(() => {
  if (searchResults.length === 0 && !selectedMovie) {
    const filtered = movies
      .filter((m) => !!m.poster_path && m.vote_average && m.vote_average > 7.0 && m.popularity && m.popularity > 80.0)
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    setSearchResults(filtered);
  }
}, [searchResults.length, selectedMovie]);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden px-4 md:px-8 pt-32">
      <Container>
        <div className="flex flex-col items-center w-full mx-auto mb-20">
          <Title subtitle='Wybierz film, a my znajdziemy podobne'gradientFrom="from-indigo-400" gradientVia="via-fuchsia-400" gradientTo="to-purple-400">
            Generowanie Rekomendacji
          </Title>
          <div className="mt-8 w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="Wpisz tytuł filmu..." />
          </div>  
          {searchResults.length > 0 && (
            <>
              <h2 className="text-white/80 text-sm mt-2">
                {searchQuery
                  ? `Wyniki dla: "${searchQuery}"`
                  : 'Ostatnio popularne:'}
              </h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => fetchRecommendations(movie)}
                    className="cursor-pointer"
                  >
                    <SmallMovieCard movie={movie} onSelect={fetchRecommendations} />
                  </div>
                ))}
              </div>
            </>
        )}
          {selectedMovie && (
            <div className="flex flex-col items-center w-full mx-auto">
              <h2 className="text-white/80 text-sm mt-2">
                Rekomendacje dla: {selectedMovie.title}
              </h2>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {recommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}