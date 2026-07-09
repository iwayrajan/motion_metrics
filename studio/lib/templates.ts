// This is the core of the "config-based templates" idea: each template declares its
// fields here, and the form UI renders itself from this schema rather than being
// hand-built per template. Adding template #2 means adding one entry here (plus the
// underlying Remotion composition/calculateMetadata registration in ../../src/Root.tsx)
// — not building a new form from scratch.

export type FieldType = "text" | "textarea" | "image" | "audio" | "calloutList" | "pointList" | "pointCalloutList";

export type TemplateField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxItems?: number; // for calloutList
};

export type TemplateSchema = {
  id: string; // must match the Remotion Composition id in ../../src/Root.tsx
  name: string;
  description: string;
  aspectRatio: "9:16" | "16:9";
  fields: TemplateField[];
  exampleJson: Record<string, unknown>; // shown as a "load example" convenience, and the shape Claude should hand you when generating import-ready JSON
};

// Audio catalog — kept in sync with /mnt/skills/user/remotion/references/audio.md.
// These files already live in the main Remotion project's public/audio/ (../public/audio
// relative to this studio/ folder) — staticFile() resolves against THAT project's public
// folder at render time, not studio's own public/, so nothing needs to be duplicated here.
export const audioCatalog = [
  { file: "countdown-149998.mp3", label: "Countdown — tense/ticking build" },
  { file: "drums-152982.mp3", label: "Drums — punchy percussion" },
  { file: "emotional-inspiring-piano-amp-violin-150030.mp3", label: "Piano & Violin — warm/emotional" },
  { file: "in-slow-motion-inspiring-ambient-lounge-219592.mp3", label: "Ambient Lounge — calm" },
  { file: "nature-music-vkroxstarsinger-226067.mp3", label: "Nature — organic" },
  { file: "night-detective-226857.mp3", label: "Night Detective — moody/noir" },
  { file: "synthwave-laser-drift-251660.mp3", label: "Synthwave — retro-electronic/driving" },
];

export const templates: TemplateSchema[] = [
  {
    id: "showcase-card",
    name: "Showcase Card",
    description: "Headline, an image with animated callouts pointing at features, then a call to action.",
    aspectRatio: "9:16",
    fields: [
      { key: "hook", label: "Headline", type: "text", placeholder: "e.g. Introducing our new template" },
      { key: "imageFile", label: "Image", type: "image" },
      { key: "callouts", label: "Callouts (feature + position)", type: "calloutList", maxItems: 5 },
      { key: "cta", label: "Call to action", type: "text", placeholder: "e.g. Try it free at yoursite.com" },
      { key: "musicFile", label: "Background music", type: "audio" },
    ],
    exampleJson: {
      hook: "Introducing our new feature",
      callouts: [
        { text: "Fast setup", top: 30 },
        { text: "No credit card needed", top: 60 },
      ],
      cta: "Try it free today",
      musicFile: "drums-152982.mp3",
      // note: imageFile is NOT included — JSON can't carry an actual image file, upload that separately
    },
  },
  {
    id: "price-chart",
    name: "Price / Value Over Time",
    description: "A glowing line chart for any metric over time — price history, growth, rankings by value. Ends on a hero number for the latest point.",
    aspectRatio: "9:16",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "e.g. BTC Price Every June" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. 2021-2026" },
      { key: "unitPrefix", label: "Unit prefix (e.g. $)", type: "text", placeholder: "$" },
      { key: "points", label: "Data points (label + value)", type: "pointList", maxItems: 8 },
      { key: "callouts", label: "Callouts (which point + text)", type: "pointCalloutList", maxItems: 3 },
      { key: "heroLabel", label: "Hero label (e.g. \"Today\")", type: "text", placeholder: "Today" },
      { key: "accentColor", label: "Accent color (hex)", type: "text", placeholder: "#00E5FF" },
      { key: "sourceText", label: "Source / disclaimer text", type: "text", placeholder: "e.g. CoinGecko, not financial advice" },
      { key: "musicFile", label: "Background music", type: "audio" },
    ],
    exampleJson: {
      title: "BTC Price Every June",
      subtitle: "2021-2026",
      unitPrefix: "$",
      points: [
        { label: "2021", value: 35041 },
        { label: "2022", value: 18917 },
        { label: "2023", value: 30447 },
        { label: "2024", value: 62678 },
        { label: "2025", value: 107289 },
        { label: "2026", value: 58504 },
      ],
      callouts: [
        { pointIndex: 1, label: "2022 crypto winter low", color: "#ef4444" },
        { pointIndex: 5, label: "Today", color: "#00E5FF" },
      ],
      heroLabel: "Today",
      accentColor: "#00E5FF",
      sourceText: "StatMuse — not financial advice",
      musicFile: "synthwave-laser-drift-251660.mp3",
    },
  },
];
