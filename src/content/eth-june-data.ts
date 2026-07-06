// CONFIDENCE LEVELS (be upfront about this — don't treat all six as equally solid):
// - 2026: EXACT — CoinCodex official daily close (Jun 30 -> Jul 01 row), $1,569.01
// - 2025: CALCULATED — Fortune's June 30, 2026 article stated ETH was "approximately a $927
//   decrease compared to this time last year" from $1,558.78 intraday -> ~$2,485.78
// - 2021-2024: APPROXIMATE — reconstructed from market-commentary articles (price ranges,
//   "closed near $X" summaries), not a single verified daily-close database. Good enough for
//   an illustrative trend video; re-verify against CoinGecko/CoinMarketCap's exact CSV export
//   before using these four in anything more rigorous than a Short.
// IMPORTANT: unlike Bitcoin, "ETH" collides with an unrelated NYSE stock ticker (Ethan Allen)
// on some data tools (StatMuse) — don't trust an "ETH price" lookup without confirming it's
// actually returning Ethereum, not the stock.

export type PricePoint = { year: number; price: number; confidence: "exact" | "calculated" | "approximate" };

export const ethJunePrices: PricePoint[] = [
  { year: 2021, price: 2275, confidence: "approximate" },
  { year: 2022, price: 1067, confidence: "approximate" },
  { year: 2023, price: 1919, confidence: "approximate" },
  { year: 2024, price: 3433, confidence: "approximate" },
  { year: 2025, price: 2486, confidence: "calculated" },
  { year: 2026, price: 1569.01, confidence: "exact" },
];

export const MAX_PRICE = 4000; // chart y-domain ceiling (headroom above the 2024 high)
