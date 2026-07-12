# Known pitfalls

Real bugs hit in past builds, generalized so they don't recur in a different chart type. Read this before writing any multi-stage `<Sequence>` timing.

## 1. Staged sub-animations get cut off because the Sequence duration exactly matches the "finish" frame
**What happened**: a donut chart drew 3 segments in stages (Android → iOS → other) inside a fixed-length per-year `<Sequence>`. The segment durations summed to *more* than the Sequence's length, so the last segment (and the visible "fully drawn" hold on the second-to-last) got truncated by the Sequence boundary before the eye could register completion.

**The fix, generalized**: when a Sequence contains N staged sub-animations, its `durationInFrames` must be **stage timings + a hold buffer**, not just the stage timings themselves:
```ts
// WRONG — no room to breathe once the last stage finishes
const YEAR_DURATION = ANDROID_DRAW + IOS_DRAW + OTHER_DRAW; // e.g. 16+16+6 = 38

// RIGHT — leave ~15-20 frames (0.5s+) of hold after the last stage completes
const HOLD_BUFFER = 18;
const YEAR_DURATION = ANDROID_DRAW + IOS_DRAW + OTHER_DRAW + HOLD_BUFFER; // 56
```
Applies to: donut segment draws, bar-chart-race era transitions, any multi-part reveal inside one timed block. Rule of thumb: **compute the buffer explicitly and name it as a constant** — don't let it be an implicit side effect of a round duration number that happens to work.

## 2. The primary chart unmounts the moment the closing stat-cards/source-line Sequence starts
**What happened**: the chart's per-year Sequences spanned frames 60→510. The closing beat (`CARDS_START`) was a sibling `<Sequence from={510}>` with nothing behind it — so the moment the closing hold began, the finished chart disappeared entirely, leaving cards floating on an empty background.

**The fix, generalized**: the primary visual must stay mounted and visible through the closing hold. Two ways to do this correctly:
```tsx
// WRONG — sibling Sequences, chart unmounts when this one starts
<Sequence from={60} durationInFrames={450}>{chartYears}</Sequence>
<Sequence from={510}>{closingCards}</Sequence>

// RIGHT — either extend the chart's own Sequence through the end...
<Sequence from={60}>{chartYears /* no durationInFrames cap, or capped at full video length */}</Sequence>
<Sequence from={510}>{closingCards}</Sequence>

// ...or explicitly re-render the final state as its own persistent piece
<Sequence from={60} durationInFrames={450}>{chartYears}</Sequence>
<Sequence from={510}>
  <FinalChartState /> {/* the completed chart, rendered statically */}
  {closingCards}
</Sequence>
```
The first approach (extend the real Sequence, don't cap it early) is simpler and is what every chart-types.md template assumes — **the closing beat is an overlay on top of the finished chart, not a replacement for it.** When scaffolding a new chart type, explicitly check: does the primary visual's Sequence duration reach all the way to the video's final frame (directly, or via "no durationInFrames" = default to parent length)? If not, that's this bug waiting to happen.

**The mirror-image mistake** (hit later, in `TipsCarousel`): a section's `<Sequence>` with **no** `durationInFrames` at all defaults to running through the rest of the video — fine when that section is meant to persist (the chart case above), a real bug when the *next* section needs the stage to itself. The bullets list had no duration cap, so it stayed mounted and visible underneath the CTA card that appeared after it, causing an overlap. The general rule cuts both ways: explicitly decide, for every Sequence, whether it should persist to the end (omit `durationInFrames`) or hand off cleanly to what comes next (cap it, and consider a short fade-out in the last ~15 frames rather than an abrupt cut) — don't leave it as an accidental default either way.

## 3. Callout/label text clipped at the canvas edge for first/last data points
**What happened**: a "today" callout on the last data point (rightmost, `x = CHART_RIGHT`) was centered on that point with a fixed-width box (`left: x - 160, width: 320`). For a point sitting at the right edge of the chart, that centered box extended 60px past the canvas's right edge, clipping the text. The same math would clip the first point's label off the left edge too — it just happened not to occur there because the actual label text was empty/short in that case.

**The fix, generalized**: never center a label on `x` unconditionally when `x` can be near an edge (first or last data point, outermost bubble, etc.). Clamp the label's horizontal position to stay within the canvas margins:
```ts
const LABEL_WIDTH = 320;
const CANVAS_MARGIN = 24; // minimum gap from the true edge

const rawLeft = x - LABEL_WIDTH / 2;
const clampedLeft = Math.max(
  CANVAS_MARGIN,
  Math.min(rawLeft, CANVAS_WIDTH - LABEL_WIDTH - CANVAS_MARGIN)
);
```
Applies to: any callout, tooltip, or annotation positioned relative to a data point in a line/bar/scatter chart — check this whenever the point can land within roughly half a label-width of either edge, not just for points that happen to be exactly at the edge (a point at 90% of chart width with a wide label can clip just as easily as one at 100%).

## 4. `getCompositions()` in the studio evaluates EVERY template's `calculateMetadata`, not just the one requested
**What happened**: the render API used `getCompositions(serveUrl, {inputProps}).find(c => c.id === templateId)` to fetch metadata for the requested composition. `getCompositions` evaluates `calculateMetadata` for **every** `<Composition>` registered in `Root.tsx`, using the same `inputProps` for all of them — so submitting Countdown-shaped content crashed with `Cannot read properties of undefined (reading 'length')` because `price-chart`'s `calculateMetadata` tried to read `props.content.points` (which doesn't exist on Countdown content) before the code ever got to the Countdown composition it actually wanted.

**The fix, generalized**: use `selectComposition({serveUrl, id, inputProps, browserExecutable})` from `@remotion/renderer` instead — it resolves metadata for **only** the requested composition id, never touching the others. This is the correct API for "I want composition X with these props," full stop; `getCompositions` is for listing/inspecting everything, not for a targeted render.
```ts
// WRONG in a multi-template studio — evaluates calculateMetadata for every registered composition
const compositions = await getCompositions(serveUrl, { inputProps });
const composition = compositions.find((c) => c.id === templateId);

// RIGHT — only touches the one composition being rendered
const composition = await selectComposition({ serveUrl, id: templateId, inputProps, browserExecutable });
```
This only bites once a studio has 2+ templates with `calculateMetadata` functions expecting different content shapes — invisible with just one template, which is exactly why it wasn't caught building `showcase-card` or `price-chart` alone, only once `countdown` was added as a third, differently-shaped template.

## 5. List items wrapped in per-item `<Sequence>` overlap instead of stacking
**What happened**: `TipsCarousel`'s bullets each render inside their own `<Sequence from={i * BULLET_GAP}>` so they can stagger-reveal one at a time. But `<Sequence>` defaults to `layout="absolute-fill"` — it silently wraps its children in a full-screen `AbsoluteFill` (`position: absolute; inset: 0`) unless told otherwise. That meant every bullet was independently pinned to the same full-screen position instead of stacking in the parent's `flex-direction: column` — all five bullets rendered directly on top of each other.

**The fix, generalized**: any time a `<Sequence>` wraps something that's meant to participate in **normal document flow** (a flex/grid sibling relying on the parent's layout to position it) rather than something that's **already self-positioned** (explicit `position: absolute; top: Xpx / left: Ypx` computed by the component itself), pass `layout="none"`:
```tsx
// WRONG — each bullet gets wrapped in its own full-screen AbsoluteFill, all pinned to the same spot
{bullets.map((b, i) => (
  <Sequence key={i} from={i * GAP}><BulletRow text={b} /></Sequence>
))}

// RIGHT — bullets stack normally in the parent's flex column
{bullets.map((b, i) => (
  <Sequence key={i} from={i * GAP} layout="none"><BulletRow text={b} /></Sequence>
))}
```
**Why this didn't affect any other composition's staggered lists** (bars, callouts, ranked-item slides): everything else built so far already self-positions via explicit absolute coordinates computed by the component itself (e.g. `left: pointX(i)`, `top: ${top}%`) — wrapping an already-absolutely-positioned element in another full-screen absolute wrapper is redundant but harmless, since both cover the same area. It's specifically **flex/grid-flow children** (like `BulletRow`, which relies on its parent's `flexDirection: column` to stack) that break. When adding a new template: if a staggered list of items looks like it should flow normally (stack vertically/horizontally via the parent's layout, not each individually positioned), reach for `layout="none"` from the start rather than discovering the overlap after rendering.

**Process note**: automated frame verification is **not** the default anymore (the person checks renders manually to save tokens/time — see the Verification section of the main SKILL.md). That means these bugs will now surface via the person watching the actual render and reporting back, not via an automated check catching them first. When that happens: fix the root cause, generalize the lesson into this file (as has been done for all five bugs above), and don't assume a re-render is wanted — ask.
