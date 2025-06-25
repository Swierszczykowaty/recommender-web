"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Hook do odczytu parametrów z URL
import Link from "next/link";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";
import MovieCard from "@/components/movies/MovieCard";
import type { Movie } from "@/types/movie";
import allMovies from "@/data/full_data_web.json";

// Definicja typu dla odpowiedzi z API
interface RecommendationResponse {
  recommendations: { id: number; title: string }[];
}

const movies: Movie[] = allMovies as Movie[];

export default function RecommendationResultPage() {
  const [baseMovie, setBaseMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams(); // Używamy hooka do pobrania parametrów
  const movieId = params.id as string; // ID filmu z URL

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);

      // 1. Znajdź film bazowy na podstawie ID z URL
      const foundBaseMovie = movies.find((m) => m.id.toString() === movieId);

      if (!foundBaseMovie) {
        setError("Nie znaleziono filmu o podanym ID.");
        setLoading(false);
        return;
      }
      setBaseMovie(foundBaseMovie);

      // 2. Wyślij zapytanie do API o rekomendacje
      try {
        const res = await fetch("http://127.0.0.1:8000/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movie_id: foundBaseMovie.id }),
        });

        if (!res.ok) {
          throw new Error("Błąd podczas pobierania rekomendacji z serwera.");
        }

        const data: RecommendationResponse = await res.json();

        const matched = movies.filter((m) =>
          data.recommendations.some((r) => r.id === m.id)
        );

        setRecommendations(matched);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Wystąpił nieoczekiwany błąd.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]); 

  return (
    <section className="relative min-h-screen flex justify-center overflow-hidden pt-32">
      <Container>
        {loading && (
          <p className="text-white text-center">Ładowanie rekomendacji...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && baseMovie && (
          <div className="flex flex-col items-center w-full mx-auto">
            <Title
              subtitle={`Rekomendacje na podstawie filmu:`}
              gradientFrom="from-emerald-400"
              gradientVia="from-cyan-400"
              gradientTo="to-sky-400"
            >
              {baseMovie.title}
            </Title>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <Link
              href="/recommender"
              className="mt-12 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Wyszukaj ponownie
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
