import { Suspense } from "react";
import dynamic from "next/dynamic";
import moviesDataRaw from "@/data/full_data_web.json";
import type { Movie } from "@/types/movie";
import Loading from "@/components/global/Loading";

const MoviesList = dynamic(() => import("@/components/movies/MovieList"));

export default function Page() {
  const movies = moviesDataRaw as Movie[];

  return (
    <Suspense fallback={<Loading message="Ładowanie filmów..." />}>
      <MoviesList movies={movies} />
    </Suspense>
  );
}
