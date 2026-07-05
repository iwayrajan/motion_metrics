import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";
import { TITLE_DURATION } from "./config";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  // fade-in 400ms (12 frames), hold, fade out over the last 15 frames of this sequence
  const opacity = interpolate(
    frame,
    [0, 12, TITLE_DURATION - 15, TITLE_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fontFamilies.data,
          fontWeight: 700,
          fontSize: 48,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        World's Most Populous Countries
      </div>
      <div
        style={{
          fontFamily: fontFamilies.data,
          fontWeight: 400,
          fontSize: 20,
          color: "#9ca3af",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Population in millions · 2026 Estimates
      </div>
    </AbsoluteFill>
  );
};
