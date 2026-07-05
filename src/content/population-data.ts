export type FlagBand = { color: string; weight: number }; // weight fractions sum to 1, top→bottom

export type Country = {
  rank: number;
  name: string;
  code: string;
  population: number; // millions
  continent: string;
  growthPct: number; // annual growth rate % (illustrative for unlisted countries — see note below)
  bands: FlagBand[];
};

export const MAX_POPULATION = 1460; // India

// NOTE: growth-rate figures are only explicitly given in the brief for India (+0.7%)
// and China (-0.3%). The rest are reasonable illustrative estimates for this demo —
// swap in exact UN figures before treating this as a sourced publication.
export const countries: Country[] = [
  {
    rank: 1,
    name: "India",
    code: "IN",
    population: 1460,
    continent: "Asia",
    growthPct: 0.7,
    bands: [
      { color: "#FF9933", weight: 1 / 3 },
      { color: "#FFFFFF", weight: 1 / 3 },
      { color: "#138808", weight: 1 / 3 },
    ],
  },
  {
    rank: 2,
    name: "China",
    code: "CN",
    population: 1410,
    continent: "Asia",
    growthPct: -0.3,
    bands: [
      { color: "#FFDE00", weight: 0.15 },
      { color: "#DE2910", weight: 0.85 },
    ],
  },
  {
    rank: 3,
    name: "United States",
    code: "US",
    population: 341,
    continent: "N. America",
    growthPct: 0.5,
    bands: [
      { color: "#B31942", weight: 1 / 3 },
      { color: "#FFFFFF", weight: 1 / 3 },
      { color: "#0A3161", weight: 1 / 3 },
    ],
  },
  {
    rank: 4,
    name: "Indonesia",
    code: "ID",
    population: 280,
    continent: "Asia",
    growthPct: 0.8,
    bands: [
      { color: "#FF0000", weight: 0.5 },
      { color: "#FFFFFF", weight: 0.5 },
    ],
  },
  {
    rank: 5,
    name: "Pakistan",
    code: "PK",
    population: 240,
    continent: "Asia",
    growthPct: 1.9,
    bands: [
      { color: "#01411C", weight: 0.75 },
      { color: "#FFFFFF", weight: 0.25 },
    ],
  },
  {
    rank: 6,
    name: "Nigeria",
    code: "NG",
    population: 230,
    continent: "Africa",
    growthPct: 2.4,
    bands: [
      { color: "#008751", weight: 1 / 3 },
      { color: "#FFFFFF", weight: 1 / 3 },
      { color: "#008751", weight: 1 / 3 },
    ],
  },
  {
    rank: 7,
    name: "Brazil",
    code: "BR",
    population: 216,
    continent: "S. America",
    growthPct: 0.6,
    bands: [
      { color: "#009739", weight: 0.5 },
      { color: "#FEDD00", weight: 0.25 },
      { color: "#002776", weight: 0.25 },
    ],
  },
  {
    rank: 8,
    name: "Bangladesh",
    code: "BD",
    population: 175,
    continent: "Asia",
    growthPct: 1.0,
    bands: [
      { color: "#006A4E", weight: 0.7 },
      { color: "#F42A41", weight: 0.3 },
    ],
  },
  {
    rank: 9,
    name: "Russia",
    code: "RU",
    population: 144,
    continent: "Europe/Asia",
    growthPct: -0.2,
    bands: [
      { color: "#FFFFFF", weight: 1 / 3 },
      { color: "#0039A6", weight: 1 / 3 },
      { color: "#D52B1E", weight: 1 / 3 },
    ],
  },
  {
    rank: 10,
    name: "Ethiopia",
    code: "ET",
    population: 130,
    continent: "Africa",
    growthPct: 2.6,
    bands: [
      { color: "#009A44", weight: 1 / 3 },
      { color: "#FCDD09", weight: 1 / 3 },
      { color: "#EA0437", weight: 1 / 3 },
    ],
  },
];
