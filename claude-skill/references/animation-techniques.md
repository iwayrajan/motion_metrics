# Animation techniques

These are **motion/rendering techniques**, not full video templates — they answer "how should this element move" rather than "what chart is this." Combine one of these with a chart-type from `chart-types.md` (or with each other) to land on a specific video concept. When presenting options to the person for a content request, mix-and-match from here + chart-types.md rather than treating either list as exhaustive on its own.

Two techniques below (#7 Bar Chart Race, #4 Bubble Clouds) substantially overlap with full templates already in `chart-types.md` (#5 and #7 respectively) — treat those as the same pattern, just cross-referenced here for the specific implementation trick.

## 1. Spring-Animated Bars/Columns
Bars grow via `spring()` mapped to height/width, staggered by data index (delay = index × N frames). For extra punch: use a light spring (`damping: 12, mass: 0.5`) so bars visibly **overshoot and settle** rather than ease straight in, paired with a value counting up as it lands. More energetic/playful than the heavy-settle `damping: 75` bars used in the Flag Tower template — pick this variant when the brief wants "bouncy" rather than "solid."

## 2. SVG Line/Area Path Tracing
The line-draw technique already used in `chart-types.md` #2 (Zoom Line Graph), with one addition worth calling out: fade in a **gradient-filled area** under the path a few frames behind the line tip (~5 frame delay) — a "trailing wake." Purely a visual upgrade to the existing line-graph pattern, not a separate chart type.

## 3. Odometer / Slot-Machine Counters
Instead of a plain count-up number, stack digits in vertical columns and slide them via CSS transform like a mechanical odometer — each digit "spins" into place rather than the whole number just changing. High-impact for a single hero statistic (e.g. "today's price: $X"), overkill if you need more than 1-2 numbers on screen at once. Good as an accent on a title card or a closing stat, not as a whole video's structure.

## 4. Floating Bubble/Scatter Clouds
Same data shape as `chart-types.md` #7 (Bubble Scatter), with one added flourish: once bubbles land, give them a continuous **gentle idle bob** via `Math.sin(frame / 10)` on the y-position, so the scene feels alive rather than static after the entrance animation finishes.

## 5. Liquid-Fill / Progress Rings
A radial gauge — `<circle>` with `strokeDashoffset` animating the ring's fill to represent a percentage/proportion. Add a glow (`filter: drop-shadow`) at the leading tip of the stroke to sell momentum. Best for a single proportion (e.g. "73% of X"), not for multi-category comparisons — use the Donut Chart template (`chart-types.md` #4) instead if there are 3+ segments to compare.

## 6. Cinematic Callouts / Lower-Thirds (HUD style)
A label box that pops open (clip-path or width expansion) next to a specific data point, connected by a thin drawn line. Style it as dark glassmorphism (`backdrop-filter: blur()`) with a neon accent color for a sci-fi-HUD feel. This is a more stylized alternative to the plain glow-pulse-+-label callouts already used across every chart-types.md template — swap it in when the brief wants a punchier/edgier look rather than the default clean-editorial one.

## 7. Shifting Leaderboard (Bar Chart Race)
Same as `chart-types.md` #5. Implementation note worth keeping: flash a green/red border around a bar the exact frame it overtakes another, to punctuate the "overtake" moment — small detail, big legibility win.

## 8. Hierarchical Treemap Expansion
Nested rectangles for part-to-whole data, animated via a squarify-style layout with `spring()`-driven size changes. The "drill down" flourish: fade out the parent categories while the selected child rectangle scales to fill the viewport — a zooming/infinite-canvas transition into the next section. Good for multi-level breakdowns (e.g. "market cap by sector, then by coin within sector"); overkill for a flat single-level comparison — use Donut or Bar for those.

---

## Applying to crypto/stock content

| Ask | Technique-forward option (vs. the plain chart-types.md default) |
|---|---|
| Single coin/stock price over time | **#2 Line/Area tracing** (upgrade of the default Zoom Line Graph — adds the gradient wake) |
| Same, but wants something bouncier/more energetic | **#1 Spring bars** — one bar per year instead of a line, elastic overshoot |
| Same, but wants one big dramatic hero number | **#3 Odometer** — spin through each year's price as a giant rotating number, one at a time, instead of a chart at all |
| Portfolio/allocation | **#5 Liquid-fill ring** (single %) or Donut template (multiple %s) |
| Multi-coin ranking over years | **#7 Bar chart race** (same as chart-types.md #5) |
| Volatility/return/market-cap comparison | **#4 Bubble clouds** (same as chart-types.md #7, with idle bob) |
| Sector → coin drill-down | **#8 Treemap** |
