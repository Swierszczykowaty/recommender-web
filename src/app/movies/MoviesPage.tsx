'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';
import Container from '@/components/Container';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';
import moviesDataRaw from '@/data/full_data_web.json';
import SearchBar from '@/components/SearchBar';

const moviesData: Movie[] = moviesDataRaw as Movie[];
const ITEMS_PER_PAGE = 24;

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageFromParams = Number(searchParams.get('page')) || 1;

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(moviesData);
  const [currentPage, setCurrentPage] = useState(pageFromParams);

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(pageFromParams);
  }, [pageFromParams]);

  const handleChangePage = (page: number) => {
    router.push(`/movies?page=${page}`);
  };

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = moviesData.filter((movie) =>
    typeof movie.title === 'string' && movie.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredMovies(filtered);
    setCurrentPage(1);
  };

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const generatePagination = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 pt-32 md:pt-44">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title>Baza filmów</Title>
          <p className="text-white/80 text-sm mt-2">
            Strona {currentPage} z {totalPages}
          </p>

          <div className="mt-8 w-full max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="mt-10 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {paginatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="mt-20 flex flex-wrap gap-2 justify-center items-center">
            <button
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-white/70 border border-white/20 rounded hover:bg-white/10 disabled:opacity-30"
            >
              ← Poprzednia
            </button>

            {generatePagination().map((page, idx) =>
              typeof page === 'string' ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-white/50">…</span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => handleChangePage(page)}
                  className={`px-4 py-2 rounded-md border transition ${
                    currentPage === page
                      ? 'bg-white/30 text-white font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-white/70 border border-white/20 rounded hover:bg-white/10 disabled:opacity-30"
            >
              Następna →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
