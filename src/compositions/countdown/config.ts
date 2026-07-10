import { CountdownContent } from "../../content/types";

export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BG_DARK = "#05040a";
export const BG_GLOW = "#151024";
export const TEXT_COLOR = "#F5F0FF";
export const MUTED_COLOR = "#8a7fae";

const DEFAULT_COLORS = ["#2D6CDF", "#22A6B3", "#5B9BD5", "#7C5CFC", "#2F6FED", "#4E8CFF", "#FF5F46", "#12A594", "#D97757", "#E5E7EB"];
export const colorForIndex = (i: number) => DEFAULT_COLORS[i % DEFAULT_COLORS.length];

// log10-scaled height so a 100x+ range between #1 and #10 stays visually meaningful —
// linear scaling would make everything but #1 invisible (see references/chart-types.md #1).
export const heightFracForItems = (values: number[]): number[] => {
  const logs = values.map((v) => Math.log10(Math.max(v, 0.0001)));
  const min = Math.min(...logs);
  const max = Math.max(...logs);
  const range = max - min;
  return logs.map((l) => (range === 0 ? 1 : (l - min) / range));
};

// Timing (frames @30fps) — mobile profile: fast, punchy, real hold buffers per pitfalls.md
export const TITLE_DURATION = 45; // 1.5s
export const PER_ITEM_DURATION = 78; // 2.6s per item
export const PILLAR_GROW_END = 15;
export const WORDMARK_START = 5;
export const VALUE_START = 16;
export const FADE_OUT_START = 63; // fade begins here, item Sequence ends at PER_ITEM_DURATION — 15 frame fade
export const OUTRO_DURATION = 60; // 2s closing card

export const getDuration = (content: CountdownContent) =>
  TITLE_DURATION + content.items.length * PER_ITEM_DURATION + OUTRO_DURATION;
