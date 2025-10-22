import { NextResponse } from "next/server";
import allMoviesRaw from "@/data/full_data_web.json";
import type { Movie } from "@/types/movie";

const ALL: Movie[] = allMoviesRaw as Movie[];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
  }

  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid 'id' parameter" }, { status: 400 });
  }

  const movie = ALL.find((m) => Number(m.id) === id);
  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  const minimal = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    overview: movie.overview,
    genres: movie.genres,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
  };

  return NextResponse.json(minimal, { headers: { "Cache-Control": "public, max-age=60" } });
}
