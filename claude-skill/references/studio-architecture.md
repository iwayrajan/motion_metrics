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
- **4 templates wired up**: `showcase-card`, `price-chart`, `countdown`, and `tips-carousel` (the original BiodataBuilder vertical shorts — hook + bullets + CTA, no image needed). `tips-carousel` was the fastest addition so far since the composition already accepted a `content` prop from day one — only needed `calculateMetadata` registration + a schema entry + a `buildContent` case, no composition rewrite.
- Confirmed the "reuse an already-built composition" strategy (from this file's own guidance) pays off in proportion to how parameterized the source composition already was — `tips-carousel` took a fraction of the time `price-chart`/`countdown` did precisely because it needed zero generalization work.
- All four regression-tested together via curl after adding #4.
- 6 templates remaining.

## Known limitations, by design (MVP, not yet a multi-user product)
- No render queue (BullMQ or similar) — fine for one person clicking a button occasionally, not for concurrent multi-user traffic.
- Local disk for uploads — fine for a personal tool on one's own laptop, would need S3/Cloudinary before running anywhere else.
- No auth — this is a local-only tool, not exposed to the internet. Don't deploy this publicly without adding auth first.
