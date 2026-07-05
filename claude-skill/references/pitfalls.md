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

## Process note
Both bugs were caught by the person watching the actual render, not by `remotion compositions` (which only checks bundling, not runtime timing/mounting). This is why the Verification step in the main SKILL.md says to extract and view frames near every Sequence boundary, not just spot-check the middle — boundary frames are exactly where these bugs live.
