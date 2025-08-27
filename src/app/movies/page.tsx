import { Suspense } from "react";
import dynamic from "next/dynamic";

const MoviesList = dynamic(() => import("@/components/movies/MovieList"), {
});

export default function Page() {
  return (
    <Suspense>
      <MoviesList />
    </Suspense>
  );
}