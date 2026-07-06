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

**Process note**: this is exactly the kind of bug the Verification step's frame extraction should catch — but only if the check actually looks at the frames where edge-adjacent callouts are visible, not just Sequence-boundary frames (bug #1/#2 territory) or the midpoint. When a chart has an annotation tied to the first or last data point specifically, extract and view a frame where that annotation is on screen as a matter of course.
