export const FPS = 30;
export const DURATION = 440; // ~14.7s — punchier/faster than the BTC short (18s)
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Synthwave palette (matches the synthwave-laser-drift audio track)
export const BG_DARK = "#0a0118";
export const BG_GLOW = "#2b0b4e";
export const LINE_COLOR = "#00E5FF"; // electric cyan
export const ACCENT_PINK = "#FF2E9A";
export const ACCENT_YELLOW = "#FDB44B";
export const TEXT_COLOR = "#F5F0FF";

// Chart plot area
export const CHART_LEFT = 130;
export const CHART_RIGHT = 980;
export const CHART_TOP = 420;
export const CHART_BOTTOM = 1300; // raised from 1440 to leave room for the hero odometer + bottom safe zone

export const pointX = (index: number, count: number) =>
  CHART_LEFT + (index / (count - 1)) * (CHART_RIGHT - CHART_LEFT);
export const pointY = (price: number, maxPrice: number) =>
  CHART_BOTTOM - (price / maxPrice) * (CHART_BOTTOM - CHART_TOP);

// Timing (frames @30fps) — mobile profile: faster stagger, real hold buffers per pitfalls.md
export const TITLE_DURATION = 45; // 1.5s — punchier than desktop's 2s
export const AXES_START = 45;
export const DRAW_DURATION = 80; // ~2.7s line draw (vs BTC's 100 — faster/more energetic)
export const HOLD_BUFFER = 20; // explicit buffer per references/pitfalls.md #1
export const CALLOUT_LOW_START = DRAW_DURATION + HOLD_BUFFER; // 100, relative to AXES_START
export const CALLOUT_TODAY_START = CALLOUT_LOW_START + 70; // 170, relative to AXES_START
export const CARDS_START = 285; // absolute
export const FINAL_START = 360; // absolute
