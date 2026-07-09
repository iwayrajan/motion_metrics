import { PriceChartContent } from "../../content/types";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BG_DARK = "#05040a";
export const BG_GLOW = "#151024";
export const TEXT_COLOR = "#F5F0FF";
export const MUTED_COLOR = "#8a7fae";
export const DEFAULT_ACCENT = "#00E5FF";

// Chart plot area
export const CHART_LEFT = 130;
export const CHART_RIGHT = 980;
export const CHART_TOP = 420;
export const CHART_BOTTOM = 1300;
export const CANVAS_MARGIN = 24; // per references/pitfalls.md #3 — callout edge clamp

export const pointX = (index: number, count: number) =>
  CHART_LEFT + (count === 1 ? 0 : (index / (count - 1)) * (CHART_RIGHT - CHART_LEFT));
export const pointY = (value: number, maxValue: number) =>
  CHART_BOTTOM - (maxValue === 0 ? 0 : (value / maxValue) * (CHART_BOTTOM - CHART_TOP));

// "Nice" axis step so labels read as round numbers regardless of data scale
// (previously hardcoded per-video — e.g. ETH's [0,1000,2000,3000] — generalized here).
export const niceStep = (maxValue: number, targetSteps = 4): number => {
  if (maxValue <= 0) return 1;
  const rawStep = maxValue / targetSteps;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  let niceResidual: number;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  else niceResidual = 1;
  return niceResidual * magnitude;
};

export const getYAxisLabels = (maxValue: number): number[] => {
  const step = niceStep(maxValue);
  const labels: number[] = [];
  for (let v = 0; v <= maxValue + step * 0.5; v += step) labels.push(Math.round(v));
  return labels;
};

// Timing (frames @30fps) — mobile profile: fast, punchy, real hold buffers per pitfalls.md
export const TITLE_DURATION = 45; // 1.5s
export const AXES_START = TITLE_DURATION; // chart begins right as the title fades out
export const DRAW_DURATION = 80; // ~2.7s line draw
export const HOLD_BUFFER = 20; // explicit buffer per pitfalls.md #1 — settle time after the draw finishes
export const CALLOUTS_START = DRAW_DURATION + HOLD_BUFFER; // chart-local frame callouts begin appearing
export const CALLOUT_GAP = 55; // frames between successive callouts appearing
export const POST_CALLOUTS_GAP = 40; // hold after the last callout before the hero/closing beat
export const OUTRO_DURATION = 75; // hero odometer + source line hold, at the very end

export const getDuration = (content: PriceChartContent) => {
  const calloutCount = content.callouts?.length ?? 0;
  const chartLocalDuration =
    CALLOUTS_START + calloutCount * CALLOUT_GAP + POST_CALLOUTS_GAP + OUTRO_DURATION;
  return AXES_START + chartLocalDuration;
};
