---
name: remotion
description: Use this skill for ANY request to build a motion-graphics or data-viz video with Remotion — animated charts (bar/line/donut/area/bubble/bar-race), ranking towers, before/after comparisons, globe spins, or short-form vertical content for YouTube/Instagram/Shorts/Reels. Trigger on mentions of "Remotion," "motion graphics," "animated chart," "animated graph," "chart video," "data viz video," or requests to visualize trends over time (population, GDP, crypto/stock prices, market share, rankings) as video. Also trigger for crypto/stock price visualizations ("BTC price over 5 years," "compare stock performance," "market cap race") since these are just this skill's line-graph / bar-race patterns applied to financial data. ALWAYS consult this skill before writing Remotion code from scratch — it documents sandbox-specific gotchas (font loading, Chrome binary) that are easy to get wrong, plus 8 proven chart templates and reusable components.
---

# Remotion Motion Graphics

Builds short (typically 30s) animated data-viz / motion-graphics videos with Remotion, rendered to mp4. Covers two families of output:

1. **Data-viz explainers** (16:9, 1920×1080) — animated charts: population towers, price line graphs, market-share donuts, bar-chart races, stacked area, bubble scatter, globe spins, split-screen comparisons.
2. **Vertical short-form content** (9:16, 1080×1920) — text/bullet-style Shorts/Reels for a brand or topic (tips carousels, template showcases).

Both live happily in the same Remotion project — just different `<Composition>` entries with different dimensions.

## Before anything else: environment setup

This sandbox's network is locked to package registries (npm, pypi, etc.) — it **cannot** reach `fonts.gstatic.com` or any CDN. Two consequences, both solved once per project:

**1. Chrome for rendering.** Remotion's own Chrome download will fail. Reuse Puppeteer's cached binary instead:

```bash
find / -iname "chrome" -type f 2>/dev/null | grep puppeteer   # find the cached binary
```

Point Remotion at it via `remotion.config.ts`:

```ts
import { Config } from "@remotion/cli/config";
Config.setBrowserExecutable("/path/to/.cache/puppeteer/chrome/.../chrome");
```

(Pass `--browser-executable=...` as a one-off CLI flag if you don't want a config file.)

**2. Fonts.** Do NOT use `@remotion/google-fonts` (`loadFont()`) — it fetches `.woff2` files from `fonts.gstatic.com` at render time, which is blocked and throws CORS/network errors during bundling. Use `@fontsource/*` packages instead — they ship the actual font files inside `node_modules`, no network needed:

```bash
npm install @fontsource/poppins @fontsource/inter @fontsource/playfair-display   # etc — pick what you need
```

```ts
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
// then just use fontFamily: "'Inter'" directly — no loadFont() call
```

See `references/environment-setup.md` for the full checklist (project scaffold, tsconfig, render/verify commands) if starting a brand new project.

## If this skill directory isn't present in this sandbox
User skills (`/mnt/skills/user/`) are sandbox-local and don't reliably carry across separate chats/sessions. If you don't find this skill mounted, check the project repo for a `claude-skill/` folder (or similarly named backup) — that's the canonical fallback copy. Use it exactly as you would this file.

## Workflow

**Step 2 is a hard stop — not a suggestion, not something to skip because a similar composition already exists in the repo.** Even if you can already see the obvious answer (e.g. a `BtcJunePrices.tsx` sitting right there as a template for an ETH request), that similarity is *why* the person needs a moment to confirm — not a reason to silently reuse it. Present options and wait for a reply before writing or copying any component code.

1. **Check for an existing project first.** If the person already has a Remotion project going in this conversation/sandbox (or a repo to clone), add a new `<Composition>` to it rather than starting over — reuse the Chrome config, font setup, and any shared components. **If the target is vertical/mobile (Shorts/Reels), read `references/mobile-vs-desktop.md` before choosing type sizes or spring configs** — don't reuse a landscape composition's motion values unadjusted. This step is about reusing *infrastructure* (config, fonts, folder layout) — it does not license reusing a prior *content* decision without asking (see step 2).
2. **Propose 2-4 options before building — don't just pick one and go.** For any content request ("make a video about X"), cross-reference the decision table below with `references/animation-techniques.md` and surface a short menu of genuinely different takes (e.g. for a price-over-time request: plain Zoom Line Graph vs. Spring Bars vs. Odometer hero-number). Use `ask_user_input_v0` with tappable options so the person can pick with one tap rather than typing. **Wait for their choice before writing any code, copying any existing composition as a template, or running any data lookups** — this includes not jumping straight to "this looks just like the BTC one, I'll reuse that" even when it's true.
3. **Get real data before building anything financial or factual.** See "Data integrity" below — this is the single most common way these videos go wrong.
4. **Always ask which audio track to use, every video** — present options from `references/audio.md`'s catalog via `ask_user_input_v0`, don't auto-pick. This is a standing preference, not a one-off.
5. **Scaffold**: config constants (timing/layout), a data file, one component per visual element, a main composition file that assembles them with `<Sequence>`, register in `Root.tsx`.
6. **Render and hand it over** — see Verification below for the current (lightweight) default. Don't add token-costly checks the person didn't ask for.

## Decision table — which chart type for which content

| Content | Chart type | Why |
|---|---|---|
| Country rankings, medal counts, "top N countries by X" | **Flag Population Tower** (bar chart, flag-striped fills) | National identity is visual shorthand |
| **Crypto/stock price over time** (e.g. "BTC price every June, past 5 years"), birth rates, inflation, any single metric over time | **Zoom Line Graph** | Line draws left→right, camera zooms into key points with captions — great for "here's what happened in 2021" style storytelling |
| **Comparing multiple coins/stocks/companies ranked over time** (market cap leaderboard changing by year) | **Bar Chart Race** | Bars reorder/resize across "eras" — the classic YouTube data-race format |
| Market share, portfolio allocation, budget breakdown | **Animated Donut Chart** | Segments draw in clockwise with running total |
| Sector/composition change over years (energy mix, revenue mix) | **Stacked Area Chart** | Shows how a whole is divided and how that division shifts |
| Two things compared on 2-3 dimensions at once (risk vs return vs market cap) | **Bubble Scatter Plot** | X/Y/size encodes three variables at once |
| "Then vs now," before/after, A vs B | **Split Screen Before/After** | Parallel reveal with a center VS badge |
| "Around the world" / geography-anchored countdown | **Globe Spin & Zoom** | Best when location itself is the story |
| Quick tips/mistakes/how-to for a brand, Instagram/Shorts | **Vertical Tips Carousel** (9:16, see `assets/components/`) | Not from the source doc — built for BiodataBuilder.in but fully reusable for any brand |

If nothing fits cleanly, default to Zoom Line Graph (single metric) or Bar Chart Race (multiple competing items) — they cover the vast majority of "trend over time" requests, which is most of what crypto/stock content is.

## Data integrity — read this before touching crypto/stock/financial content

Every example in `references/chart-types.md` embeds hardcoded numbers for illustration. **For real financial or factual content, do not reuse or invent numbers** — this is financial/informational content people may actually believe and act on:

- **Web-search for the real historical data first** (e.g. CoinGecko, Yahoo Finance, CoinMarketCap, official stats agencies for non-financial data). Pull actual closing prices, actual dates.
- Put the real source in the video's source-line ("CoinGecko · historical daily close · accessed [date]"), matching what every template already does for its citation line.
- If you can't verify a number, say so to the person rather than filling the gap with a plausible-looking placeholder — a wrong number in a finance video is a bigger problem than a wrong number in a population video.
- Standard financial-content caution still applies: this is data visualization, not investment advice. Don't frame price charts as recommendations to buy/sell.

## Standard conventions (used across all 8 chart types)

- **30fps, 1920×1080 (16:9), 30 seconds (900 frames)** is the default for data-viz explainers. Vertical shorts use 1080×1920, usually 10-15s.
- **Structure**: `[0-2s]` title card fade in/out → `[2s onward]` chart builds/animates → mid-video annotation/callout on the most important data point → `[last ~8-10s]` 2-3 stat cards + source line + subtle particle drift.
- **Spring config** for bars/growth: `{ damping: 75, stiffness: 85 }`. For UI elements sliding/popping in: lighter, e.g. `{ damping: 14-18 }`.
- **Stagger** entrances by 0.3-0.5s per item (9-15 frames at 30fps).
- **Source line**: bottom-center, 11px, `#444`, fades in during the final hold.
- **Stat cards**: dark card bg, 3px colored left border, one eyebrow label + one bold stat line, slide up staggered.
- Never use real logos/images for flags or brand marks — recreate everything as flat SVG/CSS shapes (stripes, circles, rects). Keeps renders dependency-free and avoids IP issues.

## Reusable components

`assets/components/` has copy-ready `.tsx` for pieces every video needs: `TitleCard`, `StatCards`, `SourceLine`, `DriftParticles`, `springs.ts` (config presets), plus the vertical-shorts `Bokeh`/`CornerOrnament`/`DrawnDivider` set built for the BiodataBuilder brand (restyle colors for other brands). Copy the ones you need into the project's `src/components/` rather than reinventing them each time.

## Verification (default: skip it — the person checks manually)

**Default policy, per explicit instruction: do not extract/view frames automatically.** This was previously a mandatory multi-frame check, but it burns significant tokens (every viewed image costs real tokens) for something the person already does themselves after every render. Current default:

```bash
npx remotion compositions src/index.ts        # keep this — cheap (text output, no images), catches real bundling errors before a wasted render
npx remotion render src/index.ts <id> out/x.mp4
```
Then hand the file to `present_files` directly. **Do not** run `ffmpeg` frame extraction or `view` any frames unless one of these applies:
- The person explicitly asks for a visual check on this specific video
- Something about the render command itself errored or looked wrong (not "might have a bug" — an actual signal)
- It's worth a quick 1-2 frame gut-check when trying a genuinely novel pattern for the first time (not a repeat of an established chart type) — even then, default to 1 frame, not the 5-10 used previously

Rendering itself (the Chrome-headless encode time) is real compute time that doesn't shrink with fewer tokens — only the verification loop does. Don't try to "speed up" a render by reducing video length/quality unless asked; that's a different tradeoff the person hasn't requested.

When something *does* turn out broken (the person will tell you after watching it, as has happened before — see `references/pitfalls.md`), fix the code, verify it bundles with `remotion compositions`, and ask whether to re-render or just commit the unrendered fix — don't assume a re-render is wanted.

## Reference files

- `references/chart-types.md` — full parameter spec (layout, colors, timing) for all 8 chart types, restructured as tables for quick lookup
- `references/animation-techniques.md` — 8 motion/rendering techniques (spring bounce, line/area tracing, odometer counters, idle bob, liquid-fill rings, HUD callouts, race-overtake flash, treemap zoom) to mix into whichever chart type is chosen — use this alongside chart-types.md when building the options menu in step 2 of the workflow
- `references/audio.md` — how to source, place, and wire in background audio; includes a catalog of tracks already in this repo's `public/audio/`
- `references/mobile-vs-desktop.md` — **read before building any vertical short** — mobile needs a distinctly punchier design language (bigger type, bouncier motion, faster stagger, safe zones) than the landscape explainers, not the same style scaled down
- `references/pitfalls.md` — real bugs hit in past builds (Sequence timing cutting off staged animations, primary chart unmounting before the closing hold) and their generalized fixes — check against this before finalizing timing on any new multi-stage composition
- `references/environment-setup.md` — new-project scaffold checklist (package.json, tsconfig, folder structure)
