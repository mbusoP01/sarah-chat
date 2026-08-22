# Nexal AI v3.3 — R0 Intelligence Workspace

Nexal AI is a free-first browser AI workspace. Production:

**https://nexal-ai-eight.vercel.app**

The default inference path remains R0: the browser connects directly to AI Horde community compute. There is no paid GPU requirement and no Nexal inference proxy.

## Production architecture

`Browser UI → browser-safe ability layer → AI Horde / optional external tools`

Vercel serves a small static shell. Production UI assets are pinned to immutable Git commit `add711c0062825a8dad699cdab16d73e354e3b91` through jsDelivr. The Python worker, manifest and service worker are served from the Nexal Vercel origin.

## Product UI

- Multi-conversation sidebar with local search, rename, duplicate and deletion
- Persistent local chat history
- Auto-generated conversation titles
- Command palette (`Ctrl/Cmd + K`)
- Markdown-style responses and fenced code blocks
- Copy, read-aloud and regenerate message actions
- Responsive mobile/iPad navigation
- Live model-routing drawer with worker and ETA data
- Context drawer for files and webpages
- Image Studio
- Abilities/plugin page
- Workspace statistics, export and import
- Skill presets: Direct, Researcher, Builder, Business and Writer
- Installable PWA shell with network-first update-safe caching

## Core abilities

1. **AI Horde Chat** — dynamic low-refusal, balanced, fastest-capable and largest-model routing.
2. **Live Web Search** — Jina Search uses the current documented `s.jina.ai/?q=` endpoint and places bounded, timestamped live results into the composer for grounded answers. A free Jina key is required for Search.
3. **Web Reader** — webpages and public PDFs can be added to context through Jina Reader; basic Reader usage can work without a key at lower limits.
4. **File Context** — local TXT, Markdown, JSON, CSV and source-code files are read in the browser.
5. **Calculator** — arithmetic runs locally without using an LLM.
6. **Image Studio** — image generation through live AI Horde image workers.
7. **Image Vision** — uploaded images can be captioned through AI Horde interrogation workers.
8. **Voice** — browser speech recognition and speech synthesis where supported.
9. **Cloud Models** — optional Puter.js access to supported GPT, Claude and Gemini-class models without a Nexal developer API key. AI Horde remains the default engine.
10. **Workspace Tools** — local import/export, conversation management, statistics and skill presets.
11. **Python Lab** — Python 3 execution through Pyodide 0.29.4 in a dedicated browser Web Worker. Compatible packages can load from imports and results can be placed back into chat context.
12. **GitHub Repo Inspector** — reads a public repository's live metadata, README and prioritized file tree through GitHub's public API, then places bounded structured repository context into chat. Repository code is never executed by this tool.

## Provider and cost boundaries

### AI Horde

The default text/image route is community compute and remains R0. Anonymous access works without an account. A registered free Horde key can improve queue priority.

### Jina

Basic URL reading can work without a key at lower limits. Live Search requires a free Jina key under the current Reader/Search limits. Keys are stored only in browser local storage.

### Puter cloud models

Puter is optional. Nexal does not hold a developer API key or pay the model bill. Puter can provide a user free allowance; usage beyond the user's allowance is governed by the user's Puter account and Puter's current terms/pricing. This layer is not described as unlimited free inference.

### GitHub Repo Inspector

Public repository inspection does not require a stored GitHub token for light use. GitHub's unauthenticated API rate limit applies. The inspector deliberately captures text/metadata only and never evaluates fetched repository code.

### Python Lab

Python executes on the user's device in a browser Worker. It does not use a Nexal server. First launch downloads Pyodide, and imported packages may download additional WebAssembly/package assets. Code can consume local CPU/RAM and is stopped by the UI after 60 seconds.

## Routing and reliability

- Low-refusal prioritizes live Cydonia, Skyfall, Heretic/abliterated, Magnum and related models.
- Balanced routes among high-scoring capable live models.
- Fastest capable applies a quality floor so tiny models do not win only because they are idle.
- Largest available prioritizes larger capable models.
- Automatic modes submit a small model pool so another worker can pick up a request.
- Context windows adapt between 1024/2048/4096 based on prompt size.
- Discovery uses `aihorde.net` with `stablehorde.net` as a compatibility fallback.
- Text and image generation use asynchronous jobs and can be cancelled where supported.

## Privacy and security

- Conversations, workspace data, plugin settings and optional keys stay in browser storage.
- No Nexal inference server receives prompts or Horde keys.
- Local text files are read client-side before being added to prompt context.
- Workspace export strips Horde/Jina keys.
- The app uses a restrictive Content Security Policy and no-referrer policy.
- Arbitrary third-party plugin JavaScript is intentionally not executed.
- Cloud-model content goes to Puter only when the user deliberately uses the Cloud Models panel.
- GitHub Repo Inspector contacts only GitHub's public API and injects bounded text context.
- AI Horde workers are community operated, so passwords, private client information and other secrets should not be submitted there.

## Extension philosophy

The ability system borrows useful ideas from Open WebUI-style tools/actions without allowing arbitrary plugin execution. Future connectors should use explicit browser-safe HTTP boundaries such as vetted CORS-enabled APIs, OpenAPI services or carefully scoped remote tool protocols rather than executing unknown code in-page.

The existing **OpenAI-Compatible Endpoint** card is a reserved extension boundary, not a working connector yet. It should not be treated as an enabled provider until a safe endpoint allowlist/credential model is implemented.

## Quality gates

- v3 product UI was merged through PR #1.
- Premium v3.2 hardening was merged through PR #4 after the full JavaScript gate passed.
- GitHub Repo Inspector was merged through PR #5 after its CI gate passed.
- Current Jina Search compatibility was merged through PR #6 after its CI gate passed.
- CI verifies required assets and syntax-checks `app.js`, `augment.js`, `search-tools.js`, `workspace-tools.js`, `python-lab.js`, `python-worker.js`, `repo-tools.js` and `service-worker.js`.
- Production is an immutable static deployment pinned to commit `add711c0062825a8dad699cdab16d73e354e3b91`.
- The public production shell, service worker and Python worker have been fetched successfully from the stable alias after deployment.
- The old Nexal server-side inference relay remains removed.

## Source layout

- `index.html` — secure app shell
- `styles.css` — UI design system
- `app.js` — chat, conversations, Horde routing, local tools, images and voice
- `augment.js` — optional Puter cloud-model layer and legacy augmentation hooks
- `search-tools.js` — current Jina live-search behavior and grounded composer injection
- `workspace-tools.js` — workspace import/export, conversation tools and skill presets
- `python-lab.js` — Python Lab UI and run controls
- `python-worker.js` — isolated Pyodide worker runtime
- `repo-tools.js` — public GitHub repository inspection and bounded context injection
- `manifest.webmanifest` — installable-app metadata
- `service-worker.js` — update-safe offline shell fallback
- `.github/workflows/ui-check.yml` — automated asset/syntax verification

## Rollback

- `legacy-sarah-20260822` preserves the original Sarah frontend.
- Git history preserves the earlier Nexal AI R0, v3 and v3.2 states.
