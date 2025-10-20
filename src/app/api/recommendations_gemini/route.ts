import { NextResponse } from "next/server";
import allMoviesRaw from "@/data/full_data_web.json";
import type { Movie } from "@/types/movie";
import { searchMovies } from "@/lib/searchMovies";

const MOVIES: Movie[] = allMoviesRaw as Movie[];
const GEMINI_MODEL = process.env.GEMINI_MODEL_ID ?? "gemini-2.5-flash";
const MAX_RESULTS = 8;

type GeminiRecommendation = {
  title?: string;
  reason?: string;
};

type GeminiResponse = {
  recommendations?: GeminiRecommendation[];
};

function findMovieByTitle(title: string, baseMovieId: number): Movie | null {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return null;

  const exact = MOVIES.find((movie) =>
    String(movie.title ?? "").toLowerCase() === normalized
  );
  if (exact && Number(exact.id) !== Number(baseMovieId)) return exact;

  const searchMatches = searchMovies(MOVIES, title).filter(
    (movie) => Number(movie.id) !== Number(baseMovieId)
  );
  if (searchMatches.length > 0) return searchMatches[0];

  const contains = MOVIES.find(
    (movie) =>
      Number(movie.id) !== Number(baseMovieId) &&
      String(movie.title ?? "").toLowerCase().includes(normalized)
  );
  return contains ?? null;
}

function parseStructuredResponse(rawText: string): GeminiResponse {
  if (!rawText) return { recommendations: [] };
  try {
    return JSON.parse(rawText) as GeminiResponse;
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return { recommendations: [] };
    try {
      return JSON.parse(match[0]) as GeminiResponse;
    } catch {
      return { recommendations: [] };
    }
  }
}

function extractTextFromGeminiPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const candidates = (payload as { candidates?: unknown[] }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return "";

  const parts = candidates
    .flatMap((candidate) => {
      const content = (candidate as { content?: unknown }).content;
      if (!content || typeof content !== "object") return [];
      const innerParts = (content as { parts?: unknown[] }).parts;
      if (!Array.isArray(innerParts)) return [];
      return innerParts
        .map((part) => (part as { text?: string }).text ?? "")
        .filter(Boolean);
    })
    .filter(Boolean);

  return parts.join("\n").trim();
}

function buildPrompt(baseMovie: Movie): string {
  const genres = baseMovie.genres || "Unknown";
  const releaseYear = baseMovie.release_date?.slice(0, 4) ?? "Unknown";
  const overview = baseMovie.overview || "";

  const instructions = `You are an expert movie recommendation engine. Using the provided movie metadata, pick up to ${MAX_RESULTS} different movies that the viewer is likely to enjoy next. Respond strictly as JSON matching this schema: {"recommendations":[{"title":"Movie title","reason":"One concise sentence explaining why"}]}. Use well-known, released films. Do not repeat the source movie or invent titles.`;

  const metadata = `Source movie:\nTitle: ${baseMovie.title}\nYear: ${releaseYear}\nGenres: ${genres}\nOverview: ${overview}`;

  return `${instructions}\n\n${metadata}`;
}

function buildFallbackRecommendations(baseMovie: Movie) {
  const baseGenres = (baseMovie.genres ?? "")
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);

  const fallback = MOVIES.filter((movie) => {
    if (Number(movie.id) === Number(baseMovie.id)) return false;
    if (baseGenres.length === 0) return true;
    const movieGenres = (movie.genres ?? "")
      .split(",")
      .map((genre) => genre.trim());
    return movieGenres.some((genre) => baseGenres.includes(genre));
  })
    .slice(0, MAX_RESULTS)
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      why: null,
    }));

  return fallback;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured." },
      { status: 500 }
    );
  }

  let payload: { movie_id?: unknown };
  try {
    payload = (await req.json()) as { movie_id?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const movieId = Number(payload.movie_id);
  if (!Number.isFinite(movieId)) {
    return NextResponse.json(
      { error: "Field 'movie_id' must be a number." },
      { status: 400 }
    );
  }

  const baseMovie = MOVIES.find((movie) => Number(movie.id) === movieId);
  if (!baseMovie) {
    return NextResponse.json(
      { error: "Movie not found in local catalogue." },
      { status: 404 }
    );
  }

  const prompt = buildPrompt(baseMovie);

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            topP: 0.95,
          },
        }),
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gemini API request failed to send.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const isNotFound = response.status === 404;
    const hint = isNotFound
      ? `Model '${GEMINI_MODEL}' is unavailable. Set GEMINI_MODEL_ID to a supported model (see Google AI Studio → List models).`
      : undefined;
    return NextResponse.json(
      {
        error: "Gemini API request failed.",
        details: errorText || `Status ${response.status}`,
        hint,
      },
      { status: 502 }
    );
  }

  const geminiPayload = await response.json();
  const rawText = extractTextFromGeminiPayload(geminiPayload);
  const structured = parseStructuredResponse(rawText);
  const recommendations = Array.isArray(structured.recommendations)
    ? structured.recommendations
    : [];

  const mapped = recommendations
    .map((item) => {
      if (!item?.title) return null;
      const movie = findMovieByTitle(item.title, baseMovie.id);
      if (!movie) return null;
      return {
        id: movie.id,
        title: movie.title,
        why: item.reason ?? null,
      };
    })
    .filter((item): item is { id: number; title: string; why: string | null } => Boolean(item))
    .filter((item, index, self) => self.findIndex((other) => other.id === item.id) === index)
    .slice(0, MAX_RESULTS);

  const finalRecommendations =
    mapped.length > 0 ? mapped : buildFallbackRecommendations(baseMovie);

  return NextResponse.json({
    source_id: baseMovie.id,
    recommendations: finalRecommendations,
  });
}
