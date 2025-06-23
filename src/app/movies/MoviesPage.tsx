// src/app/movies/page.tsx (server component! — bez "use client")
import moviesDataRaw from "@/data/full_data_web.json";
import MoviesList from "@/components/MovieList"; // Ty sobie przenieś kod renderujący całą sekcję (filtry, paginacja itd.)
import type { Movie } from "@/types/movie";

export default function MoviesPage() {
  const moviesData = moviesDataRaw as Movie[];
  return <MoviesList movies={moviesData} />;
}
