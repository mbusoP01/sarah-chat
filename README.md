# Nexal AI — R0 Cloud AI

Nexal AI is a static online chat interface that connects the user's browser directly to AI Horde's volunteer GPU network. No paid GPU, paid inference API, or Nexal server-side inference relay is required.

Production: https://nexal-ai-eight.vercel.app

## Final architecture

Browser → AI Horde REST API → live community text worker

Vercel serves only the static HTML/JavaScript page. Prompts, the optional Horde API key, generation requests and polling go directly from the browser to AI Horde.

## Routing and reliability

- Low-refusal prioritizes live Cydonia, Skyfall, Heretic/abliterated, Magnum and related models.
- Balanced routes among high-scoring capable live models.
- Fastest capable optimizes ETA while applying a quality floor so tiny models do not win just because their queue is empty.
- Largest available prioritizes larger capable models.
- Manual model selection remains available.
- Automatic modes offer a small model pool so another suitable worker can take the job if one disappears or becomes busy.
- Short prompts automatically request smaller context windows (1024/2048/4096 as needed), which increases the number of workers that can accept them.
- Model discovery tries the current `aihorde.net` endpoint first and the compatible `stablehorde.net` endpoint second.
- Generations are asynchronous, poll from the browser, and can be cancelled.

## Response quality

- Stop sequences prevent a model from continuing into fake user/system turns.
- The default system instruction asks for direct final answers rather than reasoning-style narration.
- A live Cydonia 24B probe returned exactly `NEXAL_DIRECT_OK` using these settings.

## Cost

The core path is R0/$0. Anonymous AI Horde access works using its documented anonymous API key. A registered Horde account/key remains free and can improve queue priority; the Settings panel links directly to AI Horde registration.

## Privacy and security

- Chat history and settings stay in browser storage.
- The optional Horde key is sent directly to AI Horde, not through a Nexal/Vercel inference server.
- The page uses a restrictive Content Security Policy and a no-referrer policy.
- AI Horde uses community-operated workers, so do not submit passwords, private client information or other secrets.

## Verification

- AI Horde CORS was verified to allow browser origins, the `apikey` and `Client-Agent` headers, and the required request methods.
- Live model discovery and real text generation were tested successfully.
- The production JavaScript passed a syntax check before deployment.
- The old Nexal `/api` relay was removed and now returns 404.

## Rollback

The pre-Nexal original Sarah frontend is preserved on branch `legacy-sarah-20260822`.
