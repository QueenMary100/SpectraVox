import { NextResponse } from 'next/server';
import { callRaindrop } from '@/lib/raindrop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt || 'Create a short 30 second explainer video script.';

    const result = await callRaindrop({ command: 'smartinference.run', input: { prompt } });
    const script = result?.output || result?.text || JSON.stringify(result);

    // Placeholder: we're not creating a real video here. Return the generated script.
    return NextResponse.json({ script });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
