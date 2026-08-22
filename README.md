# Nexal AI — R0 Cloud AI

Nexal AI is an online, zero-cost-first chat interface backed by AI Horde volunteer GPU workers and deployed on Vercel.

Production: https://nexal-ai-eight.vercel.app

Architecture: Browser → Vercel static UI → one Vercel API function → AI Horde.

The browser submits an asynchronous Horde generation, then polls the job until a worker returns the answer. Automatic routing can choose a small pool of suitable live models to reduce queue stalls.

Routing modes: low-refusal, balanced, fastest live with a quality floor, largest available, or manual model selection.

The core path requires no paid GPU and no paid inference account. Anonymous AI Horde access works without an account; a registered free Horde key is optional and can improve queue priority.

Privacy: AI Horde uses community-operated workers. Do not submit passwords, private client information or other secrets.

API: `GET /api?op=health`, `GET /api?op=models`, `POST /api?op=chat`, `GET /api?op=job&id=...`, `DELETE /api?op=job&id=...`.

The original Sarah frontend is preserved on branch `legacy-sarah-20260822`.
