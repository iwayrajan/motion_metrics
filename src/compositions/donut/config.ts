import { DonutChartContent } from "../../content/types";

export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BG_DARK = "#05040a";
export const BG_GLOW = "#151024";
export const TEXT_COLOR = "#F5F0FF";
export const MUTED_COLOR = "#8a7fae";

// Ring geometry
export const CX = 540;
export const CY = 620;
export const RADIUS = 300;
export const STROKE_WIDTH = 70;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
export const GAP_DEGREES = 2; // small visual gap between segments

const DEFAULT_COLORS = ["#00E5FF", "#FF2E9A", "#FDB44B", "#7C5CFC", "#22C55E", "#EF4444", "#22A6B3"];
export const colorForIndex = (i: number) => DEFAULT_COLORS[i % DEFAULT_COLORS.length];

// Timing (frames @30fps) — mobile profile: fast, punchy, real hold buffers per pitfalls.md
export const TITLE_DURATION = 45; // 1.5s
export const DONUT_START = TITLE_DURATION;
export const SEGMENT_DRAW_DURATION = 26; // ~0.87s per segment, back-to-back
export const HOLD_BUFFER = 20; // per pitfalls.md #1 — settle time after the last segment lands
export const CLOSING_DURATION = 100; // rotation + closing-stat crossfade + legend + source line hold

export const getDuration = (content: DonutChartContent) => {
  const segmentsDuration = content.segments.length * SEGMENT_DRAW_DURATION;
  return TITLE_DURATION + segmentsDuration + HOLD_BUFFER + CLOSING_DURATION;
};
