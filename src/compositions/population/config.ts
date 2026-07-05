export const FPS = 30;
export const DURATION = 900; // 30s

export const BG = "#0b0b14";

// Layout
export const BAR_WIDTH = 100;
export const BAR_GAP = 44;
export const BASELINE_Y = 740;
export const MAX_BAR_HEIGHT = 500;
export const CHART_LEFT_MARGIN = 90;
export const CHART_RIGHT_MARGIN = 50;
export const BARS_START_X = 110; // first bar's left edge, leaves room for y-axis labels

// Timing (frames @30fps)
export const TITLE_DURATION = 60; // 0-2s
export const BARS_START = 60; // 2s
export const BAR_STAGGER = 12; // 0.4s between bar starts
export const BAR_GROW_DURATION = 60; // spring settle window used for value-label timing

export const INDIA_EFFECT_START = 210; // 7s
export const CARDS_START = 360; // 12s
export const CARDS_STAGGER = 15; // 0.5s
export const GROWTH_START = 540; // 18s
export const GROWTH_STAGGER = 9; // 0.3s
export const FINAL_START = 720; // 24s

export const barX = (index: number) => BARS_START_X + index * (BAR_WIDTH + BAR_GAP);
export const heightForPopulation = (pop: number, maxPop: number) =>
  (pop / maxPop) * MAX_BAR_HEIGHT;
