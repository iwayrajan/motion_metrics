import { BarChartRaceContent } from "./types";

// Placeholder used only as the Composition's defaultProps in Root.tsx — real content
// comes from the studio form's submitted inputProps at render time.
export const barRaceDefault: BarChartRaceContent = {
  type: "BarChartRace",
  id: "bar-race-default",
  title: "Sample Race",
  subtitle: "Placeholder data",
  unitPrefix: "$",
  eras: [
    {
      label: "2023",
      values: [
        { name: "Item A", value: 30 },
        { name: "Item B", value: 20 },
        { name: "Item C", value: 10 },
      ],
    },
    {
      label: "2025",
      values: [
        { name: "Item A", value: 40 },
        { name: "Item B", value: 60 },
        { name: "Item C", value: 25 },
      ],
    },
  ],
  sourceText: "Sample data",
};
