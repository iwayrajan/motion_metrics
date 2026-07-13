import { DonutChartContent } from "./types";

// Placeholder used only as the Composition's defaultProps in Root.tsx — real content
// comes from the studio form's submitted inputProps at render time.
export const donutDefault: DonutChartContent = {
  type: "DonutChart",
  id: "donut-default",
  title: "Sample Allocation",
  subtitle: "Placeholder data",
  segments: [
    { name: "Category A", share: 45, color: "#00E5FF" },
    { name: "Category B", share: 30, color: "#FF2E9A" },
    { name: "Category C", share: 25, color: "#FDB44B" },
  ],
  centerLabel: "Total",
  closingStat: "Sample stat",
  sourceText: "Sample data",
};
