export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const upstream = `http://localhost:8000/api/recommendations?${searchParams.toString()}`;
  const r = await fetch(upstream, { cache: "no-store" });
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}
