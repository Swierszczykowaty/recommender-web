import { NextResponse } from "next/server";
import allMoviesRaw from "@/data/full_data_web.json";
import type { Movie } from "@/types/movie";
import { searchMovies } from "@/lib/searchMovies";
import { sortMovies } from "@/lib/sortMovies";

const ALL: Movie[] = allMoviesRaw as Movie[];
const DEFAULT_PAGE_SIZE = 24;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(
    60,
    Math.max(6, parseInt(searchParams.get("perPage") || String(DEFAULT_PAGE_SIZE), 10))
  );

  const query = (searchParams.get("query") || "").toLowerCase();
  const genre = searchParams.get("genre") || "";
  const language = (searchParams.get("language") || "").toLowerCase();
  const minRating = parseFloat(searchParams.get("rating") || "0");
  const minYear = parseInt(searchParams.get("year") || "1900", 10) || 1900;
  const sortBy = searchParams.get("sort") || "";

  // FILTRACJA i SZUKANIE – wszystko na serwerze
  let filtered = searchMovies(ALL, query).filter((movie) => {
    const g = movie.genres?.split(", ") ?? [];
    const langs = (movie.spoken_languages ?? "")
      .split(",")
      .map((l) => l.trim().toLowerCase());
    return (
      (genre === "" || g.includes(genre)) &&
      (movie.vote_average ?? 0) >= minRating &&
      parseInt(movie.release_date?.slice(0, 4) || "0", 10) >= minYear &&
      (language === "" || langs.includes(language))
    );
  });

  filtered = sortMovies(filtered, sortBy);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  // WAŻNE: zwróć tylko pola potrzebne do listy (odchudzamy payload)
  const minimalItems = items.map((m) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    release_date: m.release_date,
    vote_average: m.vote_average,
    genres: m.genres,
    spoken_languages: m.spoken_languages,
  }));

  return NextResponse.json({
    page,
    perPage,
    total,
    totalPages,
    items: minimalItems,
  }, {
    // cache na chwilę (jeśli dane statyczne, możesz podnieść)
    headers: { "Cache-Control": "public, max-age=60" }
  });
}
