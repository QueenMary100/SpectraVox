import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, voice = 'alloy' } = body || {};
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Missing ELEVENLABS_API_KEY' }, { status: 500 });

    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;
    const res = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const textErr = await res.text().catch(() => '');
      return NextResponse.json({ error: `ElevenLabs error: ${res.status} ${textErr}` }, { status: res.status });
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'audio/mpeg';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return NextResponse.json({ audio: base64, contentType });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
