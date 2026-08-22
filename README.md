# Nexal AI — R0 Cloud AI

Nexal AI is a static online chat interface that connects the user's browser directly to AI Horde's volunteer GPU network. No paid GPU, paid inference API, or Nexal server-side inference relay is required.

Production: https://nexal-ai-eight.vercel.app

## Final architecture

Browser → AI Horde REST API → live community text worker

Vercel only serves the static HTML/JavaScript page. Prompts, optional Horde API keys, generation requests and polling go directly from the browser to AI Horde. AI Horde currently permits browser CORS access for the required methods and headers.

## Routing

- Low-refusal: prioritizes live Cydonia, Skyfall, Heretic/abliterated, Magnum and related models.
- Balanced: routes among the highest-scoring capable live models.
- Fastest capable: optimizes ETA while applying a quality floor so tiny models do not win only because their queue is empty.
- Largest available: prioritizes larger capable models.
- Manual model selection is also available.

Automatic modes provide a small model pool so AI Horde can use another suitable live worker when one disappears or becomes busy.

## Reliability and response quality

- Asynchronous generation with browser polling.
- Stop sequences prevent the model from continuing into fake user/system turns.
- Direct-answer system instruction reduces reasoning-style rambling.
- Chat history and settings persist locally in the browser.
- Generation requests can be cancelled when starting a new chat.

## Cost

The core path is R0/$0. Anonymous AI Horde access works with its documented anonymous key. A registered free Horde key is optional and can improve queue priority.

## Privacy

AI Horde uses community-operated workers. Do not submit passwords, private client information or other secrets. The page warns about this explicitly.

## Verification

- AI Horde CORS was verified to allow `*` origins, the `apikey` and `Client-Agent` headers, and POST/GET/OPTIONS/PUT/DELETE/PATCH methods.
- Live model discovery and real text generation were tested successfully.
- A Cydonia 24B prompt-quality test returned exactly `NEXAL_DIRECT_OK` with the final stop/direct-answer settings.
- The production static JavaScript passed a syntax check before deployment.

## Rollback

The pre-Nexal original Sarah frontend is preserved on branch `legacy-sarah-20260822`.
