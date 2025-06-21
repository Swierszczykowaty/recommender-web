'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import Title from '@/components/Title';
import Container from '@/components/Container';
import MovieCard from '@/components/MovieCard';
import SmallMovieCard from '@/components/SmallMovieCard';
import SearchBar from '@/components/SearchBar';
import type { Movie } from '@/types/movie';
import allMovies from '@/data/full_data_web.json';

interface Recommendation {
  id: number;
  title: string;
}

const movies: Movie[] = allMovies as Movie[];

export default function RecommenderPage() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  const handleSearch = (query: string) => {
  const filtered = movies.filter(
    (movie) => typeof movie.title === 'string' && movie.title.toLowerCase().includes(query.toLowerCase())
  );
    setSearchResults(filtered.slice(0, 10)); // limit wyników
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
}, []);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden px-4 md:px-8 pt-32 md:pt-44">
      <Container>
        <div className="flex flex-col items-center w-full mx-auto">
          <Title subtitle='Wybierz film, a my znajdziemy podobne!'>
            Generowanie Rekomendacji
          </Title>
          <div className="mt-8 w-full max-w-2xl">
          
          <SearchBar onSearch={handleSearch} placeholder="Wpisz tytuł filmu..." />
          </div>  
          
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full mb-16">
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
          )}

          {selectedMovie && (
            <div className="mt-16 w-full">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Rekomendacje dla: {selectedMovie.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
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