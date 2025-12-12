import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, planId, successUrl, cancelUrl } = body || {};
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }

    // Allow using named plan ids mapped to environment price IDs.
    const price =
      priceId ||
      (planId === 'pro'
        ? process.env.STRIPE_PRICE_PRO
        : planId === 'pro_plus'
        ? process.env.STRIPE_PRICE_PRO_PLUS
        : process.env.STRIPE_PRICE_FREEMIUM || process.env.STRIPE_PRICE_FREE);

    if (!price) {
      return NextResponse.json({ error: 'Missing priceId and no mapping found for planId' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('mode', 'subscription');
    params.append('line_items[0][price]', price);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/account`);
    params.append('cancel_url', cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}`);

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
