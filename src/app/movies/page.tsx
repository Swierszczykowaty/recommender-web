import dynamic from "next/dynamic";

const MoviesList = dynamic(() => import("@/components/movies/MovieList"));

export default function Page() {
  return <MoviesList />;
}
