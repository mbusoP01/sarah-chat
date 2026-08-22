# Nexal AI v3.6 — R0 Intelligence Workspace

Nexal AI is a free-first browser AI workspace built around low-refusal community inference, local tools, grounded research, persistent context and browser-local project inspection.

**Current production:** https://nexal-ai-eight.vercel.app

The default inference path remains R0: the browser connects directly to AI Horde community compute. There is no paid GPU requirement and no Nexal inference proxy.

## Source vs production status

The maintained Nexal source lives on `migration/nexal-ai-extract-20260822`. Nexal AI v3.6 source is merged there at commit `07c21ffdad9a17b85a72b3d1a23b3d72d67402a7`.

The current Vercel production wrapper is still the previously deployed v3.4 direct deployment and serves UI assets pinned to immutable Git commit `5c749f01a629b913fc7ee5772707c1f6dbd6441c`. v3.6 must not be described as live until that owner-gated production wrapper is explicitly promoted to the newer source and re-verified.

Sarah remains separate on `main`; Nexal work must not overwrite Sarah again.

## Architecture

`Browser UI → browser-safe ability layer → AI Horde / optional external tools`

Vercel serves the owner-gated shell. Most intelligence and tooling runs in the browser. Conversations, workspace data, Context Vault items and optional provider keys are stored locally unless the user deliberately sends a request to an external inference or research provider.

## Product UI

- Multi-conversation sidebar with local search, rename, duplicate and deletion
- Persistent local chat history and auto-generated conversation titles
- Command palette (`Ctrl/Cmd + K`)
- Markdown-style responses, fenced code blocks and message actions
- Responsive desktop/mobile/iPad navigation
- Responsive Tools dock for Cloud Models, Workspace, Python Lab and Repo Inspector
- Live model-routing drawer with worker and ETA data
- Context drawer for files and webpages
- Context Engine with recall preview and pinned Context Vault
- Local Project Lens with source-folder/file selection, file-tree preview and relevance-ranked source context
- Image Studio and Abilities/plugin page
- Workspace statistics, export/import and skill presets
- Installable PWA shell with network-first update-safe caching

## Core abilities

1. **AI Horde Chat** — dynamic low-refusal, balanced, fastest-capable and largest-model routing.
2. **Context Engine** — browser-local cross-conversation retrieval selects relevant prior chat fragments and pinned notes, preserves provenance labels and injects a bounded context pack into text-generation requests.
3. **Context Vault** — pin useful decisions, facts, instructions or snippets from chat; preview what would be recalled; configure recall size; import/export the local vault.
4. **Local Project Lens** — select a local source folder or source files, build a bounded project tree, rank files against the current request and inject the most relevant excerpts into Horde or optional Puter requests without introducing a Nexal code-upload server.
5. **Shared Prompt Budget** — after context/project augmentation, normalizes oversized Horde prompts, prioritizes the system instruction and latest user request, trims older history first and upgrades augmented requests to the 4096 context tier.
6. **Live Web Search** — Jina Search uses `s.jina.ai/?q=` and places bounded live results into the composer for grounded answers. A free Jina key is required for Search.
7. **Web Reader** — webpages and public PDFs can be added to context through Jina Reader; basic Reader usage can work without a key at lower limits.
8. **File Context** — local TXT, Markdown, JSON, CSV and source-code files are read in the browser.
9. **Calculator** — arithmetic runs locally without using an LLM.
10. **Image Studio** — image generation through live AI Horde image workers.
11. **Image Vision** — uploaded images can be captioned through AI Horde interrogation workers.
12. **Voice** — browser speech recognition and speech synthesis where supported.
13. **Cloud Models** — optional Puter.js access to supported GPT, Claude and Gemini-class models without a Nexal developer API key. AI Horde remains the default engine.
14. **Workspace Tools** — local import/export, conversation management, statistics and skill presets.
15. **Python Lab** — Python 3 execution through Pyodide 0.29.4 in a dedicated browser Web Worker. Compatible packages can load from imports and results can be placed back into chat context.
16. **GitHub Repo Inspector** — reads a public repository's live metadata, README and prioritized file tree through GitHub's public API, then places bounded structured repository context into chat. Repository code is never executed by this tool.

## Context Engine v3.5+

The context layer targets context blindness without adding a Nexal memory server.

- Relevant past messages are scored locally using query overlap, recency and bounded relevance heuristics.
- The active conversation is excluded from cross-chat recall by default because its recent messages are already present in normal prompt history.
- Recalled items include provenance labels such as conversation title and source type.
- Recall is capped by both item count and character budget.
- A Context button exposes automatic-recall controls, a live recall preview and the Context Vault.
- Individual chat messages can be pinned into the vault.
- AI Horde text prompts are augmented at the browser request boundary.
- Optional Puter cloud-model prompts receive the same local recall layer.
- Likely passwords, passcodes, OTPs, API keys, bearer tokens, recovery phrases and similar secrets are excluded from automatic conversation-history recall.
- The Context Engine adds no new network provider and no paid dependency.

## Local Project Lens v3.6

The project layer is designed for codebase inspection without blindly shipping an entire local repo to a new Nexal backend.

- Folder selection uses browser file APIs; multi-file selection is available as a fallback.
- Accepted source files are held in the current browser runtime.
- `node_modules`, `.git`, build output, caches, vendor directories, virtual environments and similar bulky paths are ignored.
- Lockfiles, `.env` files, credential/secret files, private-key formats and service-account files are excluded.
- Common OpenAI-style keys, GitHub tokens, AWS access keys, bearer tokens and password/token assignments inside accepted source text are redacted before project context is built.
- Up to a bounded number of project files are ranked against the current prompt using path and content relevance.
- A bounded file tree and selected source excerpts can be previewed before use.
- Project context can be toggled off or cleared without deleting the user's actual files.
- AI Horde and Puter cloud-model paths both receive project context when enabled.

## Prompt-budget reliability

Context Engine and Project Lens can both enlarge prompts after the base app has chosen a Horde context tier. v3.6 adds a shared inner request boundary so the final augmented prompt is normalized before it reaches Horde.

- Final augmented Horde prompts are capped to a bounded character budget.
- System instructions and the latest user request are retained with higher priority.
- Explicit file/web context, project context and persistent recall each receive bounded sections.
- Older conversation history is the first material trimmed under pressure.
- Augmented text requests are normalized to `max_context_length: 4096`.

## Provider and cost boundaries

### AI Horde
The default text/image route is community compute and remains R0. Anonymous access works without an account. A registered free Horde key can improve queue priority.

### Jina
Basic URL reading can work without a key at lower limits. Live Search requires a free Jina key under the current Reader/Search limits. Keys are stored only in browser local storage.

### Puter cloud models
Puter is optional. Nexal does not hold a developer API key or pay the model bill. Puter can provide a user free allowance; usage beyond that allowance is governed by the user's Puter account and Puter's current terms/pricing. This layer is not described as unlimited free inference.

### GitHub Repo Inspector
Public repository inspection does not require a stored GitHub token for light use. GitHub's unauthenticated API rate limit applies. The inspector captures text/metadata only and never evaluates fetched repository code.

### Python Lab
Python executes on the user's device in a browser Worker. It does not use a Nexal server. First launch downloads Pyodide; imported packages may download additional assets. Runs can consume local CPU/RAM and the UI stops them after 60 seconds.

## Routing and reliability

- Low-refusal prioritizes live Cydonia, Skyfall, Heretic/abliterated, Magnum and related models.
- Balanced routes among high-scoring capable live models.
- Fastest capable applies a quality floor so tiny models do not win only because they are idle.
- Largest available prioritizes larger capable models.
- Automatic modes submit a small model pool so another worker can pick up a request.
- Base context windows adapt between 1024/2048/4096 based on prompt size; v3.6 normalizes augmented Horde requests to the 4096 tier.
- Discovery uses `aihorde.net` with `stablehorde.net` as a compatibility fallback.
- Text and image generation use asynchronous jobs and can be cancelled where supported.

## Privacy and security

- Conversations, Context Vault data, workspace data, plugin settings and optional keys stay in browser storage.
- Local Project Lens source data stays in the current browser runtime until it is deliberately included in an inference request.
- No Nexal inference server receives prompts or Horde keys.
- Local text files are read client-side before being added to prompt context.
- Workspace export strips Horde/Jina keys; the Context Vault has its own local import/export controls.
- The app uses a restrictive Content Security Policy and no-referrer policy.
- Arbitrary third-party plugin JavaScript is intentionally not executed.
- Cloud-model content goes to Puter only when the user deliberately uses Cloud Models.
- GitHub Repo Inspector contacts only GitHub's public API and injects bounded text context.
- Automatic conversation recall and Local Project Lens both include credential-reduction controls before context is sent.
- AI Horde workers are community operated, so passwords, private client information and other secrets should not be submitted there.

## Extension philosophy

The ability system borrows useful ideas from Open WebUI-style tools/actions without allowing arbitrary plugin execution. Future connectors should use explicit browser-safe HTTP boundaries such as vetted CORS-enabled APIs, OpenAPI services or carefully scoped remote tool protocols rather than executing unknown code in-page.

The existing **OpenAI-Compatible Endpoint** item remains a reserved extension boundary, not a working connector. It stays visibly disabled rather than exposing a misleading active toggle.

## Quality gates

- v3 product UI was merged through PR #1.
- Premium v3.2 hardening was merged through PR #4 after the full JavaScript gate passed.
- GitHub Repo Inspector was merged through PR #5 after CI passed.
- Current Jina Search compatibility was merged through PR #6 after CI passed.
- Responsive premium UI polish was merged through PR #7 after CI passed.
- Context Engine v3.5 was merged through PR #14 after UI Check run #39 passed.
- Local Project Lens + shared prompt budget v3.6 was merged through PR #16 after UI Check run #58 passed.
- CI verifies all required assets and syntax-checks the full JavaScript surface, including `prompt-budget.js`, `context-engine.js`, `project-tools.js` and their tests.
- `context-engine.test.mjs` verifies relevant cross-chat recall, provenance injection and credential-like secret filtering.
- `project-tools.test.mjs` verifies secret-file exclusion, in-source credential redaction and relevance ranking.
- `prompt-budget.test.mjs` verifies oversized augmented prompts retain system/project/memory/current-request sections inside budget.
- `augmentation-integration.test.mjs` runs the combined Prompt Budget → Context Engine → Project Lens request path and verifies bounded final size, 4096 context normalization, relevant project/memory retention and seeded secret-history exclusion.
- Current production remains the immutable v3.4 deployment pinned to commit `5c749f01a629b913fc7ee5772707c1f6dbd6441c` until a separate promotion is completed.
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
- `prompt-budget.js` — final augmented Horde prompt budgeting and context-tier normalization
- `context-engine.js` — persistent browser-local recall, Context Vault and prompt augmentation
- `project-tools.js` — browser-local source-folder inspection and relevance-ranked project context
- `prompt-budget.test.mjs` — prompt-budget smoke test
- `context-engine.test.mjs` — recall/privacy smoke test
- `project-tools.test.mjs` — project relevance/privacy smoke test
- `augmentation-integration.test.mjs` — combined augmentation request-path smoke test
- `ui-polish.js` — responsive tools dock, focus/sidebar polish and reserved-feature labeling
- `manifest.webmanifest` — installable-app metadata
- `service-worker.js` — update-safe offline shell fallback
- `.github/workflows/ui-check.yml` — automated asset, syntax and behavior verification

## Rollback and separation

- `legacy-sarah-20260822` preserves the original Sarah frontend.
- `main` is Sarah-only and must remain separate from Nexal AI.
- `migration/nexal-ai-extract-20260822` is the maintained Nexal source branch.
- Git history preserves earlier Nexal AI R0, v3, v3.2, v3.3, v3.4 and v3.5 states.