import { PriceChartContent } from "./types";

// Placeholder used only as the Composition's defaultProps in Root.tsx — real content
// comes from the studio form's submitted inputProps at render time.
export const priceChartDefault: PriceChartContent = {
  type: "PriceChart",
  id: "price-chart-default",
  title: "Sample Price Chart",
  subtitle: "Placeholder data",
  unitPrefix: "$",
  points: [
    { label: "2023", value: 100 },
    { label: "2024", value: 250 },
    { label: "2025", value: 180 },
  ],
  callouts: [{ pointIndex: 1, label: "Peak", color: "#00E5FF" }],
  heroLabel: "Latest",
  accentColor: "#00E5FF",
  sourceText: "Sample data — not financial advice",
};
