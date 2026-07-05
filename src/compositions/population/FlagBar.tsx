import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";
import { Country, MAX_POPULATION } from "../../content/population-data";
import { BASELINE_Y, MAX_BAR_HEIGHT, BAR_WIDTH, barX, heightForPopulation } from "./config";

export const FlagBar: React.FC<{ country: Country; index: number }> = ({ country, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const targetHeight = heightForPopulation(country.population, MAX_POPULATION);
  const growth = spring({ frame, fps, config: { damping: 75, stiffness: 85 } });
  const currentHeight = targetHeight * growth;

  const x = barX(index);
  const top = BASELINE_Y - currentHeight;

  // Population value counts up over ~15 frames once the bar is mostly grown
  const valueRevealStart = 40;
  const countProgress = interpolate(frame, [valueRevealStart, valueRevealStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayedValue = Math.round(country.population * countProgress);
  const valueOpacity = interpolate(frame, [valueRevealStart, valueRevealStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <>
      {/* bar with clipped flag stripes */}
      <div
        style={{
          position: "absolute",
          left: x,
          top,
          width: BAR_WIDTH,
          height: Math.max(currentHeight, 0.01),
          borderRadius: "6px 6px 0 0",
          overflow: "hidden",
          border: "1px solid #ffffff15",
          borderBottom: "none",
        }}
      >
        {/* flag stripes stretch with the container since they're percentage-height */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {country.bands.map((band, i) => (
            <div key={i} style={{ width: "100%", height: `${band.weight * 100}%`, background: band.color }} />
          ))}
        </div>
        {/* top edge definition line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#ffffff" }} />
      </div>

      {/* population value above bar */}
      <div
        style={{
          position: "absolute",
          left: x,
          width: BAR_WIDTH,
          top: top - 28,
          textAlign: "center",
          fontFamily: fontFamilies.data,
          fontWeight: 700,
          fontSize: 15,
          color: "#ffffff",
          opacity: valueOpacity,
        }}
      >
        {displayedValue.toLocaleString("en-US")}M
      </div>

      {/* country name + code below baseline */}
      <div
        style={{
          position: "absolute",
          left: x,
          width: BAR_WIDTH,
          top: BASELINE_Y + 12,
          textAlign: "center",
          fontFamily: fontFamilies.data,
          fontWeight: 500,
          fontSize: 13,
          color: "#ffffff",
          opacity: labelOpacity,
        }}
      >
        {country.name}
      </div>
      <div
        style={{
          position: "absolute",
          left: x,
          width: BAR_WIDTH,
          top: BASELINE_Y + 32,
          textAlign: "center",
          fontFamily: fontFamilies.data,
          fontWeight: 400,
          fontSize: 11,
          color: "#9ca3af",
          opacity: labelOpacity,
        }}
      >
        {country.code}
      </div>
    </>
  );
};
