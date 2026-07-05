import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";
import { Country } from "../../content/population-data";
import { BASELINE_Y, MAX_BAR_HEIGHT, BAR_WIDTH, barX, heightForPopulation, GROWTH_STAGGER } from "./config";
import { MAX_POPULATION } from "../../content/population-data";

const MAX_GROWTH_WIDTH = 60;

export const GrowthIndicator: React.FC<{ country: Country; index: number }> = ({ country, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - index * GROWTH_STAGGER;
  const enter = spring({ frame: Math.max(local, 0), fps, config: { damping: 18 }, durationInFrames: 15 });
  const opacity = interpolate(local, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isPositive = country.growthPct >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";
  const barWidth = (Math.abs(country.growthPct) / 3) * MAX_GROWTH_WIDTH * enter; // scaled to a 3% reference max

  const x = barX(index);
  const barTop = BASELINE_Y - heightForPopulation(country.population, MAX_POPULATION) - 52;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        width: BAR_WIDTH,
        top: barTop,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ height: 4, width: Math.max(barWidth, 2), background: color, borderRadius: 2 }} />
      <div
        style={{
          fontFamily: fontFamilies.data,
          fontSize: 10,
          fontWeight: 600,
          color,
          marginTop: 3,
        }}
      >
        {isPositive ? "+" : ""}
        {country.growthPct.toFixed(1)}%
      </div>
    </div>
  );
};
