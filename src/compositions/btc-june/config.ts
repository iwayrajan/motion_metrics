export const FPS = 30;
export const DURATION = 540; // 18s
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BG = "#0b0b14";
export const LINE_COLOR = "#F7931A"; // bitcoin orange
export const LINE_COLOR_LIGHT = "#FFC876";

// Chart plot area
export const CHART_LEFT = 130;
export const CHART_RIGHT = 980;
export const CHART_TOP = 420;
export const CHART_BOTTOM = 1440;

export const pointX = (index: number, count: number) =>
  CHART_LEFT + (index / (count - 1)) * (CHART_RIGHT - CHART_LEFT);
export const pointY = (price: number, maxPrice: number) =>
  CHART_BOTTOM - (price / maxPrice) * (CHART_BOTTOM - CHART_TOP);

// Timing (frames @30fps)
export const TITLE_DURATION = 60; // 0-2s
export const AXES_START = 60; // 2s
export const DRAW_START = 15; // relative to AXES_START — 2.5s absolute
export const DRAW_DURATION = 100; // ~3.3s
export const CALLOUT_LOW_START = 140; // relative to AXES_START (~6.7s absolute)
export const CALLOUT_TODAY_START = 200; // relative to AXES_START (~8.7s absolute)
export const CARDS_START = 280; // absolute (~11.3s)
export const FINAL_START = 360; // absolute (~14s)
