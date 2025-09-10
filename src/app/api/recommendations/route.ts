export async function POST(req: Request) {
  const body = await req.text();
   const upstream = "http://localhost:8000/api/v2/recommendations";
  //const upstream = "https://recommender-api-f6qb.onrender.com/api/v2/recommendations";
  const r = await fetch(upstream, { method: "POST", headers: { "content-type": "application/json" }, body, cache: "no-store" });
  const txt = await r.text();
  return new Response(txt, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}
