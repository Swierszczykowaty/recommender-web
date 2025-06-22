import type { Movie } from "@/types/movie";

export function sortMovies(movies: Movie[], sortBy: string): Movie[] {
  const sorted = [...movies]; // kopiujemy dane wejściowe

  switch (sortBy) {
    case "title-asc":
      return sorted.sort((a, b) =>
        (a.title ?? "").toString().localeCompare((b.title ?? "").toString())
      );
    case "title-desc":
      return sorted.sort((a, b) =>
        (b.title ?? "").toString().localeCompare((a.title ?? "").toString())
      );
    case "rating-desc":
      return sorted.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    case "rating-asc":
      return sorted.sort((a, b) => (a.vote_average ?? 0) - (b.vote_average ?? 0));
    case "year-desc":
      return sorted.sort(
        (a, b) =>
          parseInt(b.release_date?.slice(0, 4) || "0") -
          parseInt(a.release_date?.slice(0, 4) || "0")
      );
    case "year-asc":
      return sorted.sort(
        (a, b) =>
          parseInt(a.release_date?.slice(0, 4) || "0") -
          parseInt(b.release_date?.slice(0, 4) || "0")
      );
    default:
      return sorted;
  }
}
