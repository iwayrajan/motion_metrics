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

export type VideoContent = TipsCarouselContent | ShowcaseCardContent | PriceChartContent;
