import { CountdownContent } from "./types";

// Placeholder used only as the Composition's defaultProps in Root.tsx — real content
// comes from the studio form's submitted inputProps at render time.
export const countdownDefault: CountdownContent = {
  type: "Countdown",
  id: "countdown-default",
  title: "Top 3 Sample Items",
  subtitle: "By Value",
  unitPrefix: "$",
  items: [
    { name: "First Place", value: 100, unitSuffix: "B", note: "Sample" },
    { name: "Second Place", value: 50, unitSuffix: "B", note: "Sample" },
    { name: "Third Place", value: 20, unitSuffix: "B", note: "Sample" },
  ],
  closingText: "Sample closing text",
};
