// src/app/movies/page.tsx
import { Suspense }      from "react";
import dynamic            from "next/dynamic";
import moviesDataRaw      from "@/data/full_data_web.json";
import type { Movie }     from "@/types/movie";

const MoviesList = dynamic(() => import("@/components/movies/MovieList"));

export default function Page() {
  const movies = moviesDataRaw as Movie[];

  return (
    <Suspense
      fallback={
        <div className="text-white text-center py-10">
          Ładowanie filmów...
        </div>
      }
    >
      <MoviesList movies={movies} />
    </Suspense>
  );
}
