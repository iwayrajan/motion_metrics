export type TipsCarouselContent = {
  type: "TipsCarousel";
  id: string;
  hook: string; // big opening line, first 2-3s
  bullets: string[]; // 3-5 short points, one revealed at a time
  cta: string; // closing call-to-action line
  musicFile?: string; // filename inside public/audio, optional
};

export type ShowcaseCardContent = {
  type: "ShowcaseCard";
  id: string;
  hook: string;
  imageFile: string; // filename inside public/images
  callouts: { text: string; top: number }[]; // top = % from top of image, 0-100
  cta: string;
  musicFile?: string;
};

export type PriceChartContent = {
  type: "PriceChart";
  id: string;
  title: string;
  subtitle: string;
  unitPrefix?: string; // e.g. "$" — shown before every number
  points: { label: string; value: number }[]; // x-axis label (e.g. a year) + y value
  callouts?: { pointIndex: number; label: string; color?: string }[]; // up to ~3, edge-clamped per pitfalls.md #3
  heroLabel?: string; // e.g. "Today" — shown above the closing odometer of the last point
  accentColor?: string; // line/glow color, defaults to a cyan if omitted
  sourceText?: string; // citation shown in the closing hold
  musicFile?: string;
};

export type CountdownItem = {
  name: string;
  value: number; // assumes a CONSISTENT unit across all items — don't mix e.g. billions and millions
  unitSuffix?: string; // e.g. "B", "T", "M", "%"
  color?: string; // pillar/wordmark color for this item, defaults per-item if omitted
  note?: string; // one-line context under the value, e.g. "Series H"
};

export type CountdownContent = {
  type: "Countdown";
  id: string;
  title: string;
  subtitle: string;
  unitPrefix?: string; // e.g. "$" — shown before every value
  items: CountdownItem[]; // enter in #1-first order (like a normal top-10 list) — reversed internally for the build-up reveal
  closingText?: string; // e.g. "Which one hits $1T first?"
  sourceText?: string;
  musicFile?: string;
};

export type DonutSegment = { name: string; share: number; color?: string }; // share should sum to ~100 across all segments

export type DonutChartContent = {
  type: "DonutChart";
  id: string;
  title: string;
  subtitle: string;
  segments: DonutSegment[]; // 3-7 ideal — more gets visually cluttered
  centerLabel?: string; // e.g. "Total" shown under the running % while segments draw
  closingStat?: string; // e.g. "$2.4B AUM" — center text crossfades to this once fully drawn
  sourceText?: string;
  musicFile?: string;
};

export type VideoContent = TipsCarouselContent | ShowcaseCardContent | PriceChartContent | CountdownContent | DonutChartContent;
