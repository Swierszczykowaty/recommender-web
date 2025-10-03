import { NextResponse } from 'next/server';

export async function GET() {
  const upstream = "https://recommender-api-f6qb.onrender.com/health";
  try {
    const res = await fetch(upstream, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
    return NextResponse.json({ status: 'error' }, { status: res.status });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to connect to the upstream server.' }, { status: 500 });
  }
}
