import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { countries, MAX_POPULATION } from "../content/population-data";
import { TitleCard } from "./population/TitleCard";
import { ChartAxis } from "./population/ChartAxis";
import { FlagBar } from "./population/FlagBar";
import { IndiaHighlight, ReferenceLine } from "./population/IndiaHighlight";
import { ContinentCards } from "./population/ContinentCards";
import { GrowthIndicator } from "./population/GrowthIndicator";
import { DriftParticles, SourceLine } from "./population/FinalHold";
import {
  BG,
  TITLE_DURATION,
  BARS_START,
  BAR_STAGGER,
  INDIA_EFFECT_START,
  CARDS_START,
  GROWTH_START,
  FINAL_START,
  BASELINE_Y,
  MAX_BAR_HEIGHT,
} from "./population/config";

const REFERENCE_500M_Y = BASELINE_Y - (500 / MAX_POPULATION) * MAX_BAR_HEIGHT;

export const PopulationChart: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Placeholder — add your own background track and uncomment:
      <Audio src={staticFile('bg-music.mp3')} volume={0.18} /> */}

      {/* [0-2s] Title card */}
      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard />
      </Sequence>

      {/* [2s onward] Axis, bars, and everything chart-related stays mounted till the end */}
      <Sequence from={BARS_START}>
        <ChartAxis />

        {countries.map((country, i) => (
          <Sequence key={country.code} from={i * BAR_STAGGER}>
            <FlagBar country={country} index={i} />
          </Sequence>
        ))}

        {/* [7-12s+] India glow + annotation + 500M reference line, relative to bars-start */}
        <Sequence from={INDIA_EFFECT_START - BARS_START}>
          <IndiaHighlight />
          <ReferenceLine valueLabel="500 Million" y={REFERENCE_500M_Y} />
        </Sequence>

        {/* [18s+] Growth-rate mini indicators */}
        <Sequence from={GROWTH_START - BARS_START}>
          {countries.map((country, i) => (
            <GrowthIndicator key={country.code} country={country} index={i} />
          ))}
        </Sequence>
      </Sequence>

      {/* [12-18s+] Continent breakdown cards */}
      <Sequence from={CARDS_START}>
        <ContinentCards />
      </Sequence>

      {/* [24-30s] Final hold: drifting particles + source line */}
      <Sequence from={FINAL_START}>
        <DriftParticles />
        <SourceLine />
      </Sequence>
    </AbsoluteFill>
  );
};
