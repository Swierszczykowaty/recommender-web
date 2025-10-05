import type { Movie } from "@/types/movie";

let fullMoviesCache: Movie[] | null = null;
let fullMoviesPromise: Promise<Movie[]> | null = null;

export async function getFullMovies(): Promise<Movie[]> {
  if (fullMoviesCache) {
    return fullMoviesCache;
  }

  if (fullMoviesPromise) {
    return fullMoviesPromise;
  }

  fullMoviesPromise = import("@/data/full_data_web.json")
    .then((module) => {
      fullMoviesCache = module.default as Movie[];
      return fullMoviesCache;
    })
    .catch((err) => {
      console.error("Nie udało się wczytać full_data_web.json", err);
      fullMoviesPromise = null;
      return [];
    });

  return fullMoviesPromise;
}