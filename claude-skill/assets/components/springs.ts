// Copy into src/springs.ts (or inline). These are the presets used across
// all 8 chart types in references/chart-types.md — pull from here instead of
// guessing damping/stiffness numbers each time.

export const springs = {
  barGrowth: { damping: 75, stiffness: 85 }, // bars/areas growing from 0 — heavy, settled
  bounceIn: { damping: 60, stiffness: 120 }, // bubbles/cards dropping in with visible bounce
  uiPopIn: { damping: 16 }, // cards, labels sliding/popping in — snappy, minimal overshoot
  reorder: { damping: 70 }, // bar-chart-race position swaps
};

export const timing = {
  fps: 30,
  titleDuration: 60, // 2s — standard title-card window
  staggerShort: 9, // 0.3s — growth-rate indicators, dense staggers
  staggerMedium: 12, // 0.4s — bars
  staggerLong: 15, // 0.5s — stat cards, donut labels
};
