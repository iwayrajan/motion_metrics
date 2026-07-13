import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { TEXT_COLOR } from "./config";

export const TitleCard: React.FC<{ title: string; subtitle: string; durationInFrames: number }> = ({
  title,
  subtitle,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bounce = spring({ frame, fps, config: { damping: 11, stiffness: 130 } });
  const scale = interpolate(bounce, [0, 1], [0.6, 1]);
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 54, color: TEXT_COLOR }}>{title}</div>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 26, color: "#00E5FF", marginTop: 8 }}>
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
