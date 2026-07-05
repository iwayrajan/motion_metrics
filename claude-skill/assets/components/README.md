# Reusable components

Copy-ready `.tsx`/`.ts` pieces, extracted from working, rendered-and-verified videos. Drop the ones you need into the new project's `src/components/`, adjust colors/fonts to the brand, wire in.

## Data-viz explainer pieces (16:9 chart videos)
- `springs.ts` — spring/timing config presets, see references/chart-types.md for which one to use where
- `TitleCard.tsx` — the universal `[0-2s]` opening beat
- `StatCards.tsx` — the universal "2-3 insight cards" closing beat
- `FinalHold.tsx` — `SourceLine` + `DriftParticles`, the universal final-hold beat

These three cover the parts every one of the 8 chart types in `references/chart-types.md` shares. The chart-specific middle (bars, line, donut, etc.) still needs bespoke code per `references/chart-types.md`.

## Vertical shorts pieces (9:16, `vertical-shorts/`)
Built for a wedding-invite-style brand (BiodataBuilder.in) — deep maroon/gold, serif display type, ornamental line-draw motifs. Restyle the colors in each file for a different brand; the animation techniques (bokeh drift, corner ornament, line-draw divider) are brand-agnostic.
- `Bokeh.tsx` — ambient drifting particle background + radial glow background
- `CornerOrnament.tsx` — procedural SVG corner flourish (not a copy of any real artwork — safe to reuse/restyle)
- `DrawnDivider.tsx` — animated line-draw divider + top progress bar

## Why these specific patterns
Every one of these was built, rendered, and visually verified (frame-extracted and inspected) during actual project work — not just written from memory. They're the pieces that turned out to look good in practice, not a first draft.
