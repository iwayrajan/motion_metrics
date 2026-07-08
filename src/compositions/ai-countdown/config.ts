export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BG_DARK = "#05040a";
export const BG_GLOW = "#151024";
export const TEXT_COLOR = "#F5F0FF";
export const MUTED_COLOR = "#8a7fae";

// Timing (frames @30fps) — mobile profile: fast, punchy, real hold buffers per pitfalls.md
export const TITLE_DURATION = 45; // 1.5s
export const PER_COMPANY_DURATION = 78; // 2.6s per company

export const PILLAR_GROW_END = 15;
export const WORDMARK_START = 5;
export const ODOMETER_START = 16;
export const FADE_OUT_START = 63; // fade begins here, company Sequence ends at 78 — 15 frame fade
export const HOLD_BUFFER_END = 63; // fully visible/settled through this frame — buffer per pitfalls.md #1

export const OUTRO_DURATION = 60; // 2s closing card

export const companiesCount = 10;
export const DURATION = TITLE_DURATION + PER_COMPANY_DURATION * companiesCount + OUTRO_DURATION; // 45+780+60=885 (~29.5s)
