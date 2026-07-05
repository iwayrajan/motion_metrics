// Source: StatMuse (Bitcoin daily close) for 2021-2025; Fortune (intraday, ~9:15am ET)
// for June 30, 2026 since that day's finalized daily close wasn't yet in historical
// databases at time of writing. Verify against a live source before reusing this data
// after today's date.

export type PricePoint = { year: number; price: number; isIntraday?: boolean };

export const btcJunePrices: PricePoint[] = [
  { year: 2021, price: 35040.84 },
  { year: 2022, price: 18916.88 },
  { year: 2023, price: 30447.29 },
  { year: 2024, price: 62678.29 },
  { year: 2025, price: 107288.68 },
  { year: 2026, price: 58503.73, isIntraday: true },
];

export const MAX_PRICE = 120000; // chart y-domain ceiling (headroom above the 2025 peak)
