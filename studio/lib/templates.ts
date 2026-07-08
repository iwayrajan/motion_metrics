// This is the core of the "config-based templates" idea: each template declares its
// fields here, and the form UI renders itself from this schema rather than being
// hand-built per template. Adding template #2 means adding one entry here (plus the
// underlying Remotion composition/calculateMetadata registration in ../../src/Root.tsx)
// — not building a new form from scratch.

export type FieldType = "text" | "textarea" | "image" | "audio" | "calloutList";

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
  },
];
