import { ShowcaseCardContent } from "./types";

// Placeholder used only as the Composition's defaultProps in Root.tsx — real content
// comes from the studio form's submitted inputProps at render time.
export const showcaseDefault: ShowcaseCardContent = {
  type: "ShowcaseCard",
  id: "showcase-default",
  hook: "Your Headline Here",
  imageFile: "placeholder.jpg",
  callouts: [
    { text: "First feature", top: 25 },
    { text: "Second feature", top: 50 },
    { text: "Third feature", top: 75 },
  ],
  cta: "Your call to action",
};
