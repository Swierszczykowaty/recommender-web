import type { Movie } from '@/types/movie';

export function filterMovies(movies: Movie[], query: string): Movie[] {
  const lowerQuery = query.toLowerCase();

  return movies.filter((movie) => {
    const titleMatch =
      typeof movie.title === 'string' &&
      movie.title.toLowerCase().includes(lowerQuery);

    const keywordsMatch =
      typeof movie.keywords === 'string' &&
      movie.keywords.toLowerCase().includes(lowerQuery);

    return titleMatch || keywordsMatch;
  });
}
