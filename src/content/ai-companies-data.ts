// Source: aifundingtracker.com "50 Top AI Funded Startups" (June 2026 edition),
// cross-referenced across Crunchbase Pro, PitchBook Enterprise, CB Insights per their
// stated methodology. Sorted here purely by valuation (their own ranking uses a weighted
// composite of funding/valuation/momentum/revenue, which produces a non-monotonic order —
// not what we want for a "tallest pillar" visual).
//
// Known caveats (confirmed with the person, keeping as-is):
// - xAI/SpaceX: this is the MERGED entity's IPO target valuation, not xAI standalone —
//   mostly aerospace/Starlink revenue, not a "pure AI" number the way Anthropic/OpenAI are.
// - Waymo: Alphabet subsidiary (majority-owned), not a fully independent startup, though it
//   does have outside investors and its own disclosed valuation.
// - Cerebras and CoreWeave are now public (market cap, not private round valuation).

export type CompanyData = {
  rank: number; // 10 = smallest, 1 = largest, for a countdown build-up
  name: string;
  valuation: string; // pre-formatted for display, e.g. "$965B"
  accentColor: string; // thematic brand-family color, not an exact official hex
  note: string; // one-line context shown under the valuation
  heightFrac: number; // 0-1, log10-scaled — linear scaling would make #2-10 invisible next to #1's $1.75T
};

// heightFrac = (log10(valuationInBillions) - log10(min)) / (log10(max) - log10(min))
// min=16 (Scale AI), max=1750 (xAI/SpaceX)
export const aiCompanies: CompanyData[] = [
  { rank: 10, name: "Scale AI", valuation: "$16B", accentColor: "#2D6CDF", note: "Series F", heightFrac: 0.0 },
  { rank: 9, name: "Perplexity", valuation: "$22.6B", accentColor: "#22A6B3", note: "Series E-6", heightFrac: 0.074 },
  { rank: 8, name: "Figure AI", valuation: "$48B", accentColor: "#5B9BD5", note: "Series D", heightFrac: 0.234 },
  { rank: 7, name: "CoreWeave", valuation: "$50B", accentColor: "#7C5CFC", note: "Public (market cap)", heightFrac: 0.243 },
  { rank: 6, name: "Cerebras", valuation: "$95B", accentColor: "#2F6FED", note: "Public (market cap)", heightFrac: 0.380 },
  { rank: 5, name: "Waymo", valuation: "$126B", accentColor: "#4E8CFF", note: "Alphabet subsidiary", heightFrac: 0.439 },
  { rank: 4, name: "Databricks", valuation: "$134B", accentColor: "#FF5F46", note: "Series L", heightFrac: 0.453 },
  { rank: 3, name: "OpenAI", valuation: "$852B", accentColor: "#12A594", note: "Last private round", heightFrac: 0.847 },
  { rank: 2, name: "Anthropic", valuation: "$965B", accentColor: "#D97757", note: "Series H", heightFrac: 0.874 },
  { rank: 1, name: "xAI / SpaceX", valuation: "$1.75T", accentColor: "#E5E7EB", note: "Merged entity, IPO target", heightFrac: 1.0 },
];
