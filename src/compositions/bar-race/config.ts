import { BarChartRaceContent } from "../../content/types";

export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BG_DARK = "#05040a";
export const BG_GLOW = "#151024";
export const TEXT_COLOR = "#F5F0FF";
export const MUTED_COLOR = "#8a7fae";

// Layout
export const CHART_TOP = 500;
export const CHART_LEFT = 60;
export const CHART_RIGHT = 1020;
export const ROW_HEIGHT = 130;
export const BAR_HEIGHT = 90;

const DEFAULT_COLORS = ["#00E5FF", "#FF2E9A", "#FDB44B", "#7C5CFC", "#22C55E", "#EF4444", "#22A6B3", "#4E8CFF"];
export const colorForIndex = (i: number) => DEFAULT_COLORS[i % DEFAULT_COLORS.length];

// Timing (frames @30fps) — mobile profile: fast, punchy
export const TITLE_DURATION = 45; // 1.5s
export const RACE_START = TITLE_DURATION;
export const ERA_WINDOW = 90; // 3s per era (growth-in for era 0, transition+hold for the rest)
export const TRANSITION_FRAC = 0.4; // first 40% of each era's window is the resize+reorder transition
export const OUTRO_DURATION = 60; // 2s closing hold

export const getDuration = (content: BarChartRaceContent) =>
  TITLE_DURATION + content.eras.length * ERA_WINDOW + OUTRO_DURATION;

// Fixed roster order comes from the FIRST era's item list — every era should carry the
// same item names (different values), so ranks/colors stay consistent across the race.
export const getRoster = (content: BarChartRaceContent): string[] =>
  content.eras[0]?.values.map((v) => v.name) ?? [];

export const getGlobalMax = (content: BarChartRaceContent): number =>
  Math.max(1, ...content.eras.flatMap((e) => e.values.map((v) => v.value)));

export const rankOf = (values: { name: string; value: number }[], name: string): number => {
  const sorted = [...values].sort((a, b) => b.value - a.value);
  return sorted.findIndex((v) => v.name === name);
};

export const valueOf = (values: { name: string; value: number }[], name: string): number =>
  values.find((v) => v.name === name)?.value ?? 0;
