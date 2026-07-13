# Studio architecture (config-driven templates, no LLM per video)

A parallel workflow to "ask Claude to build a video in chat" — a local web app (`studio/` in the repo) where the person picks a template, fills a form, and gets an mp4, with zero LLM involvement per video. Read this before doing more studio work.

## Why this exists
The chat workflow (this skill's main sections) costs real tokens and time per video — fine for exploring a new chart type or one-off content, wasteful once a template is proven and just needs new inputs repeatedly (e.g. a new price/company every week). The studio is the "productionize it" step once a template has been validated in chat a few times.

## Architecture
- `studio/` is a **separate Next.js app** (own `package.json`, own `node_modules`) living alongside the Remotion project (`../src`), not merged into it.
- **Why separate**: Next.js's webpack tries to statically bundle everything imported into an API route, which breaks on `@remotion/bundler`/`@remotion/renderer`'s internal dynamic requires. Fix: mark them `experimental.serverComponentsExternalPackages` in `studio/next.config.js` so Next just `require()`s them natively instead of trying to bundle them. Don't remove this config — the build fails without it (real error hit and fixed during the first build).
- `studio/lib/templates.ts` is the **schema registry** — the whole point of "config-based": the gallery and form pages are generic and read from this file, so adding template #2 doesn't mean writing a new form, just a new schema entry (see `studio/README.md`'s walkthrough).
- `studio/app/api/render/route.ts` does the actual work: bundles `../src/index.ts` (cached in-memory per server process — restart the dev server after changing composition code), resolves the composition via `getCompositions`, calls `renderMedia`, writes the mp4 to `studio/public/renders/` (served statically by Next).
- Uploaded images/logos get saved into **the Remotion project's own `public/` folder** (`../public/images/uploads/`), not studio's — `staticFile()` inside a composition resolves against the bundled project's public folder, which is `../public`, not `studio/public`.

## Sandbox-specific gotcha already hit and fixed
`process.env.HOME` was `/root` inside the Next.js server process, not the actual user directory where the Puppeteer Chrome cache lived — the Chrome-binary lookup silently failed and Remotion tried (and failed, network-blocked) to download its own copy. Fixed by checking multiple hardcoded absolute paths, not just `$HOME`, in `findCachedChrome()`. On the person's own laptop this specific failure mode may not occur (normal environments usually have working Chrome auto-download), but the hardened lookup function doesn't hurt and is already in place.

## Status
- **6 templates wired up**: `showcase-card`, `price-chart`, `countdown`, `tips-carousel`, `donut-chart`, and `bar-chart-race` (new — the most animation-logic-heavy template so far: bars continuously interpolate BOTH width and vertical rank position between "eras," producing the classic overtake effect. Same item roster assumed across every era; ranks/values computed by lerping between each era's discrete snapshot with a shared eased progress).
- `bar-chart-race`'s interpolation math was verified with real pixel sampling against hand-computed expected values (not just "the render succeeded") — confirmed a mid-transition overtake (item B passing item A) landed at the exact predicted position, width, and color. Same standard as `donut-chart`'s arc verification — any template with non-trivial per-frame math (not just draw-once reveals) should get this treatment before being called done.
- The studio form gained its first genuinely nested data shape (`eraList`: era label + CSV values matching a separate roster field) — represented as flat rows with comma-separated values rather than a full 2D grid editor, since building a true nested-list-of-lists UI wasn't worth the complexity yet. Revisit this if a future template needs proper nested list editing.
- All six regression-tested together via curl.
- 4 templates remaining: Stacked Area, Bubble Scatter, Split Screen Before/After, Globe Spin.

## Known limitations, by design (MVP, not yet a multi-user product)
- No render queue (BullMQ or similar) — fine for one person clicking a button occasionally, not for concurrent multi-user traffic.
- Local disk for uploads — fine for a personal tool on one's own laptop, would need S3/Cloudinary before running anywhere else.
- No auth — this is a local-only tool, not exposed to the internet. Don't deploy this publicly without adding auth first.
