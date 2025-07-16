import type { Movie } from "@/types/movie";

export function searchMovies(movies: Movie[], query: string): Movie[] {
  const lowerQuery = query.toLowerCase();

  return movies.filter((movie) => {
    const titleMatch =
      typeof movie.title === "string" &&
      movie.title.toLowerCase().includes(lowerQuery);

    const keywordsMatch =
      typeof movie.keywords === "string" &&
      movie.keywords.toLowerCase().includes(lowerQuery);

    const directorsMatch =
      typeof movie.directors === "string" &&
      movie.directors.toLowerCase().includes(lowerQuery);

    const actorsMatch =
      Array.isArray(movie.actors) &&
      movie.actors.some(
        (actor) =>
          typeof actor.name === "string" &&
          actor.name.toLowerCase().includes(lowerQuery)
      );

    return titleMatch || actorsMatch || directorsMatch || keywordsMatch;
  });
}
