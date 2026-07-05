# Chart type specs

Eight animated-chart patterns, each parameterized. All assume 1920×1080, 30fps, ~30s (900 frames) unless noted. Fill in the bracketed values for a new video; the "Data shape" line is the TypeScript-ish shape to model in `content/types.ts`.

Standard opening/closing every type shares (don't repeat per-type below):
- `[0-2s]` title + subtitle, fade in ~400ms, hold, fade out at 2s
- `[last ~4-6s]` source line (11px, `#444`, bottom-center) + subtle drifting low-opacity particles

---

## 1. Flag / Identity Bar Tower
**Best for**: country rankings where national identity matters (population, medal counts, GDP) — or any "ranked bar chart with a symbolic fill" (e.g. crypto logos-as-colors, team colors).

- **Layout**: vertical bars, tallest left, baseline in the lower third (`y ≈ 740` of 1080). Bar width ~100px, gap ~44px. Corners rounded top-only.
- **Fill technique**: each bar is a clipped container; inside it, 2-4 horizontal color bands (weights summing to 1) recreate a flag/identity purely with flat rectangles — no images. Bands stretch proportionally as the bar grows.
- **Growth**: `spring({ damping: 75, stiffness: 85 })`, staggered ~0.4s per bar (12 frames @30fps). Value label above each bar counts up over ~500ms once grown.
- **Mid-video beat**: the #1 item gets a glow pulse + floating annotation; optional dashed reference line at a meaningful value.
- **Late beat**: 2-3 insight cards; optional secondary data layer (e.g. growth-rate mini-bars above each bar).
- **Data shape**: `{ rank, name, code, value, bands: {color, weight}[] }[]`

## 2. Zoom Line Graph (Animated Trace) — ★ primary pattern for price history
**Best for**: any single metric over time — birth rates, unemployment, **crypto/stock price**, inflation, CO2. If the request is "show me [coin/stock] price over the last N years," start here.

- **Layout**: standard axes, generous margins (left ~100px for y-labels, bottom ~180px for x-labels + captions).
- **Draw technique**: line traces left→right via `strokeDasharray`/`strokeDashoffset` over ~3.5s. Dots fade in at each data point as the line passes through.
- **Zoom beat (the signature move)**: at 3-5 chosen inflection points, "camera" scales in (`scale 1→2-2.5`, ease-in-out, ~600ms) centered on that point, the dot glows/pulses, a caption explains what happened, holds ~2s, zooms back out. Allocate ~3s per zoom point.
- **Full reveal**: camera back to 1.0, optionally shade the area between the line and a reference threshold to emphasize a gap.
- **Data shape**: `{ x: number /* year or date */, y: number }[]` plus `{ x, caption }[]` for the zoom points (3-5 ideal).
- **For crypto/stock specifically**: `x` = year (or date string), `y` = price. Use real closing prices (see Data Integrity in main SKILL.md). Good zoom-point candidates: all-time high, a crash, the most recent data point.

## 3. Globe Spin & Zoom
**Best for**: geography-anchored countdowns (largest countries by area, military spending, "around the world" narratives) — lower priority for financial content unless the story is explicitly geographic (e.g. "crypto adoption by country").

- **Technique**: CSS/SVG globe (not WebGL) — a gradient-filled circle with a simplified continent-outline overlay, "rotation" simulated by translating/clipping the outline horizontally (2D parallax, not true 3D). Small twinkling star dots on a black background sell the "space" opening.
- **Per-item beat** (~4s each): globe eases to center the location, that region glows, a data card slides in from alternating sides (name/value/one-line fact).
- **Closing**: all regions re-highlight simultaneously, globe zooms out slightly, summary stat.
- **Data shape**: `{ rank, name, value, unit, fact, color, globeCenter: {lat, lon} }[]`

## 4. Animated Donut Chart
**Best for**: market share, portfolio/budget allocation, "where does X go" breakdowns — good fit for **crypto portfolio allocation** or **exchange market-share** content.

- **Layout**: donut on one half of the canvas (e.g. `cx=480, cy=540`, outer radius ~240px, inner ~150px), other half reserved for stat cards that appear later.
- **Draw technique**: each segment is an arc drawn clockwise via `strokeDasharray`/`strokeDashoffset`, one at a time (~1.5-2s per segment), small gap between segments. Label (name + %) appears outside the ring at completion, connected by a thin leader line. Center text shows a running total percentage, then switches to a key absolute stat once complete.
- **Closing beat**: donut does a slow rotation, largest segment gets a glow, center text crossfades between two key stats.
- **Data shape**: `{ name, share /* must sum to 100 */, color }[]` — 5-7 segments is the sweet spot; 8+ gets visually cluttered.

## 5. Bar Chart Race
**Best for**: rankings that shift over time — GDP by country over decades, platform growth — and this is the standard format for **crypto market-cap leaderboards over years** or **stock performance races**.

- **Layout**: horizontal bars, fixed color per item (so a bar keeps its identity as it moves), large low-opacity year/era counter as a watermark behind the bars.
- **Technique**: data is defined in discrete "eras" (keyframes), not continuous — e.g. every 5-15 years, or every year for a shorter race. Within an era, bars hold ~3s with a callout. Transitioning between eras: the counter morphs to the new value, bars simultaneously resize (width via `interpolate`) AND reorder (translateY via spring, `damping ~70`) to their new rank — this simultaneous resize+reorder is what makes it read as a "race."
- **Pacing**: 3-5 eras fits comfortably in 30s (~6s per era including transition).
- **Data shape**: `{ era: number, data: {name, value}[] }[]` — 5-8 items per era.

## 6. Stacked Area Chart
**Best for**: composition-over-time stories — energy mix, revenue mix by product line, demographic shifts — or **sector allocation of a crypto index / stock portfolio over years**.

- **Layout**: standard axes, y-axis as percentage (0-100%) or absolute, 4-7 layers max (more blurs together visually).
- **Draw technique**: layers stack bottom-to-top by category, and the whole stack reveals left-to-right via a moving clip/mask over ~9s, not a simple fade — this is what sells "the composition changing over time." As the reveal crosses key x-axis years, briefly flash that label and optionally drop in a floating annotation.
- **Closing beats**: legend fades in (staggered, matching stack order) once fully revealed; then spotlight one layer (glow pulse) with a callout about its trend.
- **Data shape**: `{ years: number[], series: Record<category, number[]> }` — each `series[category]` array must sum to ~100 per index if using percentages.

## 7. Bubble Scatter Plot
**Best for**: comparing many items across 2-3 dimensions at once — wealth vs health, risk vs return — good for **comparing coins/stocks on volatility (x) vs return (y) vs market cap (bubble size)**.

- **Layout**: standard x/y axes (log scale is common for financial x-axes spanning orders of magnitude), bubble radius scaled by a third metric (e.g. clamp to a 20-80px range), bubble color by category/sector.
- **Technique**: bubbles drop in one at a time (staggered ~0.5s) with a bouncy spring (`damping ~60, stiffness ~120`) from above their final position — order largest-first reads better than random order. After all land, an optional dashed trend line + correlation label. Then 1-2 outlier callouts (pulse + label) for the most interesting/extreme points.
- **Data shape**: `{ name, x, y, size, group }[]` — 8-18 items; fewer looks sparse, more gets cluttered.

## 8. Split Screen Before/After
**Best for**: any binary comparison with parallel line items — then vs now, A vs B product comparison, cost-of-living-style breakdowns. Works well for **"Bitcoin price: 2020 vs 2026"** style content.

- **Layout**: vertical divider down the center (gradient between the two "sides'" accent colors), a small circular "VS" badge on the divider, each side tinted toward its accent color.
- **Technique**: rows reveal one at a time (~2s per row) — item label on the divider, values counting up simultaneously on both sides, a change badge (e.g. `+128%`) in red/green between them. Allocate 5-7 rows for 30s. The most dramatic row gets a slightly larger/pulsing badge; the row with the most interesting takeaway gets an extra annotation line.
- **Closing beats**: an optional connecting-line annotation between two rows to make a specific point (e.g. "income grew 50% but housing grew 246%"), then stat cards.
- **Data shape**: `{ item, valueA, valueB, change }[]` — 5-7 rows ideal.

---

## Applying these to crypto/stock content specifically

| Ask | Use |
|---|---|
| "BTC price every June for the past 5 years" / any single coin or stock over time | **#2 Zoom Line Graph** — x = year, y = price, zoom into notable years (ATH, crash, latest) |
| "Top 5 cryptos by market cap, 2017 vs 2021 vs 2025" | **#5 Bar Chart Race** — eras = the years you're comparing |
| "How is my portfolio split" / "market share of exchanges" | **#4 Donut Chart** |
| "BTC vs ETH vs SOL volatility and returns" | **#7 Bubble Scatter** — x = volatility, y = return, size = market cap |
| "Price then vs now" (e.g. BTC in 2020 vs today) | **#8 Split Screen** |
| "How has [sector] allocation shifted in the S&P over 20 years" | **#6 Stacked Area** |

Always get real prices via web search before building (see Data Integrity section of the main SKILL.md) — do not carry over any example numbers from this file, they're illustrative placeholders only.
