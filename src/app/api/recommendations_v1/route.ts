export async function POST(req: Request) {
  const body = await req.text();
  const upstream =
    process.env.RECOMMENDER_V1_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:8000/api/v1/recommendations"
      : "https://recommender-api-f6qb.onrender.com/api/v1/recommendations");
  const r = await fetch(upstream, { method: "POST", headers: { "content-type": "application/json" }, body, cache: "no-store" });
  const txt = await r.text();
  return new Response(txt, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}