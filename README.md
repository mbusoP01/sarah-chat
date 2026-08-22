# Nexal AI v3 — R0 Intelligence Workspace

Nexal AI is a free-first browser AI workspace. The production app runs at:

**https://nexal-ai-eight.vercel.app**

The core inference path remains R0: the browser connects directly to AI Horde community compute. There is no paid GPU requirement and no Nexal inference proxy.

## Architecture

`Browser UI → local ability layer → AI Horde / optional browser-safe tools`

Vercel serves the shell. Production JS/CSS are pinned to the immutable GitHub squash commit `e1b9d1c7d31973d99df00903b6eea48445a16851` through jsDelivr, so the live UI cannot drift when the repository changes.

## Product UI

v3 replaces the prototype chat screen with a desktop/mobile workspace:

- Multi-conversation sidebar with local search and deletion
- Persistent local chat history
- New-chat workflow and auto-generated conversation titles
- Command palette (`Ctrl/Cmd + K`)
- Markdown-style response rendering and fenced code blocks
- Code copy, message copy, read-aloud and regenerate actions
- Responsive mobile navigation
- Model routing drawer with live worker/ETA information
- Context drawer for attached files and webpages
- Settings drawer
- Image Studio
- Abilities/plugin management page
- Workspace export
- PWA manifest and offline shell fallback

## Ability layer

The browser-safe plugin system is inspired by the tool/action model used by projects such as Open WebUI, but Nexal AI does **not** execute arbitrary third-party plugin code in the browser.

Current abilities:

1. **AI Horde Chat** — dynamic low-refusal, balanced, fastest-capable and largest-model routing.
2. **Web Reader** — adds webpages and public PDFs to context through Jina Reader.
3. **File Context** — local TXT, Markdown, JSON, CSV and source-code files can be attached without uploading them to a Nexal server.
4. **Calculator** — arithmetic is executed locally before involving an LLM.
5. **Image Studio** — image generation through live AI Horde image workers.
6. **Image Vision** — uploaded images can be captioned through AI Horde interrogation/alchemy workers.
7. **Voice** — browser speech recognition and speech synthesis where supported.
8. **OpenAI-Compatible Connector** — reserved optional connector boundary for future CORS-enabled endpoints.

Reserved extension points include browser-safe OpenAPI tool servers and MCP-over-HTTP endpoints.

## Routing and reliability

- Low-refusal prioritizes live Cydonia, Skyfall, Heretic/abliterated, Magnum and related models.
- Balanced routes among high-scoring capable live models.
- Fastest capable optimizes ETA while applying a quality floor.
- Largest available prioritizes larger capable models.
- Automatic modes submit a small live model pool rather than relying on one worker.
- Context windows adapt between 1024/2048/4096 depending on prompt size.
- Model discovery uses `aihorde.net` with `stablehorde.net` as a compatibility fallback.
- Text generations are asynchronous, polled from the browser and cancellable.

## Cost

The default path is R0/$0. Anonymous AI Horde access works without an account. A registered free Horde key can improve queue priority.

Jina Reader can be used for URL reading; an optional Jina key can be stored locally in the browser for higher limits or future search capabilities.

## Privacy and security

- Conversations, plugin settings and optional keys are stored in browser local storage.
- No Nexal inference server receives prompts or Horde keys.
- User-file text is read locally before being placed into prompt context.
- The page uses a restrictive Content Security Policy and no-referrer policy.
- Arbitrary third-party plugin JavaScript is intentionally not executed.
- AI Horde workers are community operated, so do not submit passwords, private client information or other secrets.

## Quality gates

- v3 was developed on `ui-v3` and merged through PR #1.
- GitHub Actions checks required assets and runs `node --check app.js` on pushes and pull requests.
- The final branch passed that CI gate before merge.
- Production CDN assets were independently fetched after deployment: `app.js` returned JavaScript MIME type, parsed successfully and `styles.css` returned CSS MIME type.
- The previous server-side inference relay remains removed.

## Source layout

- `index.html` — secure app shell
- `styles.css` — product UI design system
- `app.js` — conversations, routing, tools and abilities
- `manifest.webmanifest` — installable-app metadata
- `service-worker.js` — update-safe offline shell fallback
- `.github/workflows/ui-check.yml` — automated asset/syntax verification

## Rollback

- `legacy-sarah-20260822` preserves the original Sarah frontend.
- Git history before PR #1 preserves the earlier Nexal AI R0 chat interface.
