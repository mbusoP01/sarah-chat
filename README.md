# Nexal AI — R0 Cloud AI

A zero-cost-first web chat that routes requests to live AI Horde text workers. It does not require a paid GPU, paid inference account, or an API key for basic use.

## Architecture

Browser → Vercel static UI → Vercel serverless API → AI Horde volunteer GPU network

The app submits generation jobs asynchronously and polls their status, avoiding long-running serverless requests while jobs wait in the Horde queue.

## Core features

- Live AI Horde model discovery
- Dynamic model ranking based on workers, ETA, queue, performance and preferred model families
- Routing modes: low-refusal, balanced, fastest live, largest available
- Anonymous R0 operation using AI Horde's documented anonymous key
- Optional personal AI Horde key stored only in the user's browser
- Conversation context, system instruction and response-length controls
- No paid fallback that could create surprise billing
- Mobile-friendly interface

## API routes

- `GET /api/models` — ranked live text models
- `POST /api/chat` — select model and submit an asynchronous generation
- `GET /api/job?id=...` — poll generation state/result
- `DELETE /api/job?id=...` — cancel a queued generation
- `GET /api/health` — Horde health and best-live-model snapshot

## Deploy

This project is Vercel-compatible with no build step and no required environment variables.

Optional server environment variable:

- `AI_HORDE_API_KEY` — a registered free Horde key to improve queue priority for all requests. Without it, the app uses AI Horde anonymous access.

## Reality of R0 hosting

The web application itself can remain online on a free hosting tier. AI inference is supplied by AI Horde volunteer workers, so latency, model availability and capacity vary. R0 does not guarantee a dedicated GPU or fixed response time.
