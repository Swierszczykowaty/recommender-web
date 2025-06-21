'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Title from '@/components/Title';
import Container from '@/components/Container';
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
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filterMovies(movies, query);
    setSearchResults(filtered.slice(0, 10));
    setSelectedMovie(null);
    setRecommendations([]);
  };

const fetchRecommendations = async (movie: Movie) => {
  setIsLoading(true);
  setSelectedMovie(movie);
  setSearchResults([]);
  setRecommendations([]);

  try {
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
  } catch (error) {
    console.error('Recommendation error:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Obsługa rekomendacji z parametru URL
  useEffect(() => {
    const recommendId = searchParams.get('recommend');
    if (recommendId && !selectedMovie) {
      const movie = movies.find((m) => m.id === Number(recommendId));
      if (movie) fetchRecommendations(movie);
    }
  }, [searchParams, selectedMovie]);

  // Wczytanie popularnych filmów raz
  useEffect(() => {
    const filtered = movies
      .filter(
        (m) =>
          !!m.poster_path &&
          m.vote_average &&
          m.vote_average > 7.0 &&
          m.popularity &&
          m.popularity > 80.0
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    setPopularMovies(filtered);
  }, []);

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden px-4 md:px-8 pt-32">
      <Container>
        <div className="flex flex-col items-center w-full mx-auto">
          <Title subtitle="Wybierz film, a my znajdziemy podobne!">
            Generowanie Rekomendacji
          </Title>

          <div className="mt-8 w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="Wpisz tytuł filmu..." />
          </div>

          {/* Wyniki wyszukiwania */}
          {searchResults.length > 0 && (
            <>
              <h2 className="text-white/80 text-sm mt-4">
                Wyniki dla: &quot;{searchQuery}&quot;
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
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

          {/* Rekomendacje */}
          {selectedMovie && recommendations.length > 0 && (
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

          {/* Ostatnio popularne */}
          {popularMovies.length > 0 && searchResults.length === 0 && !selectedMovie && !isLoading && (
            <div className="flex flex-col items-center w-full mx-auto mt-8">
              <h2 className="text-white/80 text-sm">Ostatnio popularne:</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
                {popularMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => fetchRecommendations(movie)}
                    className="cursor-pointer"
                  >
                    <SmallMovieCard movie={movie} onSelect={fetchRecommendations} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
