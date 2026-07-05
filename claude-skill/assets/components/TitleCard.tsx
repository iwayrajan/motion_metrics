// Copy into src/components/TitleCard.tsx and adjust fontFamily/colors to taste.
// Standard [0-2s] opening beat used by every chart type in references/chart-types.md.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  durationInFrames?: number; // defaults to 60 (2s @ 30fps)
  fontFamily?: string;
  color?: string;
  subtitleColor?: string;
}> = ({
  title,
  subtitle,
  durationInFrames = 60,
  fontFamily = "'Inter'",
  color = "#ffffff",
  subtitleColor = "#9ca3af",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 48, color, textAlign: "center" }}>
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 20,
            color: subtitleColor,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
