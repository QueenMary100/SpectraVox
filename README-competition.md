# Competition Integration Notes — SpectraVox by AptX & AI Champion Ship

Goal
--
Prepare SpectraVox by AptX for the LiquidMetal AI "AI Champion Ship" hackathon by wiring the app to Raindrop (LiquidMetal) and integrating ElevenLabs and Stripe. The app should be launch-ready and demonstrable in a 3-minute video.

Checklist (high level)
--
- Choose a track (voice agent, small startup agent, public good, etc.).
- Acquire Raindrop API endpoint & API key (Raindrop MCP server). Add values to `.env`.
- Acquire Vultr API key / service credentials. Add values to `.env`.
- Implement server-side proxy routes to call Raindrop and Vultr securely (done: `src/app/api/raindrop/route.ts`, `src/app/api/vultr/route.ts`).
- Build one or more Raindrop SmartComponents (SmartBuckets/SmartSQL/SmartMemory) and show usage in the app.
- For Voice Agent track: integrate ElevenLabs TTS for voice responses.
- Deploy backend to Raindrop and frontend to a public host (Netlify / Vercel / Raindrop-hosted).
- Record a 3-minute demo: show live app, explain architecture, highlight Raindrop & Vultr usage.

Developer steps (local)
--
1. Copy `.env.example` to `.env.local` and fill keys.
2. Start dev server: `npm run dev -- --turbopack -p 9002` (or `npm run dev`).
3. Test Raindrop endpoint: `POST /api/raindrop` with {"prompt":"hello"}.
4. Test Vultr endpoint: `POST /api/vultr` with service-specific payloads.

Notes about required integrations
--
- Raindrop: Use Raindrop MCP to host SmartComponents and the main backend. This code scaffolds a proxy route for local development. When deploying, point the proxy to your Raindrop-deployed endpoint.
- Vultr: Choose any Vultr service (e.g., managed inference, object storage, or compute). The proxy route demonstrates how to forward requests and use `VULTR_API_KEY` server-side.

Stripe integration and deployment notes
--
If you plan to accept payments (recommended for demoing subscription upgrades), follow LiquidMetal's Stripe integration guide: https://docs.liquidmetal.ai/tutorials/stripe-integration/#deploy-your-application

Summary steps:
- Add your Stripe keys to `.env.local` (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
- Create Stripe Price IDs for your plans and add them to env as `STRIPE_PRICE_PRO`, `STRIPE_PRICE_PRO_PLUS`, etc.
- Use the included server route `src/app/api/stripe/checkout/route.ts` to create Checkout Sessions (it uses Stripe REST API). For production you may prefer the official `stripe` SDK.
- When deploying, ensure the `STRIPE_SECRET_KEY` is set in the host environment and the `NEXT_PUBLIC_BASE_URL` points to your live site.


Submission checklist (what to include in the GitHub repo/zip)
--
- Live public URL
- Public GitHub repo with license (MIT recommended)
- `README-competition.md` (this file) summarizing how to run locally and how Raindrop & Vultr are used
- Demo video URL
