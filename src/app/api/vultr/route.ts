import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.VULTR_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Missing VULTR_API_KEY' }, { status: 500 });

    // Example: forward to a Vultr API endpoint. `body.url` should be a full Vultr API URL.
    const { url, ...payload } = body;
    if (!url) return NextResponse.json({ error: 'Missing target url in body' }, { status: 400 });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) return NextResponse.json({ error: data || 'Vultr request failed' }, { status: res.status });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
