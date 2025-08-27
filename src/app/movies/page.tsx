import { Suspense } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/global/Loading";

const MoviesList = dynamic(() => import("@/components/movies/MovieList"), {
});

export default function Page() {
  return (
    <Suspense fallback={<Loading message="Ładowanie filmów..." />}>
      <MoviesList />
    </Suspense>
  );
}
