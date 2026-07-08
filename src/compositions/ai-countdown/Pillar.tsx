import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PILLAR_GROW_END } from "./config";

const BASELINE_Y = 1500;
const PILLAR_WIDTH = 220;

export const Pillar: React.FC<{ heightFrac: number; color: string }> = ({ heightFrac, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame, fps, config: { damping: 13, mass: 0.6 }, durationInFrames: PILLAR_GROW_END });
  // heightFrac (0-1, log-scaled outside) maps to a max pillar height so #1 is visibly
  // taller than #10 without the smallest being invisible
  const maxHeight = 620;
  const minHeight = 260;
  const targetHeight = minHeight + heightFrac * (maxHeight - minHeight);
  const currentHeight = targetHeight * grow;
  const top = BASELINE_Y - currentHeight;

  const glowPulse = interpolate(frame % 60, [0, 30, 60], [0.5, 0.9, 0.5]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1080 / 2 - PILLAR_WIDTH / 2,
          top,
          width: PILLAR_WIDTH,
          height: Math.max(currentHeight, 0.01),
          borderRadius: "16px 16px 0 0",
          background: `linear-gradient(180deg, ${color}ee 0%, ${color}55 100%)`,
          boxShadow: `0 0 60px ${color}88`,
          border: `1px solid ${color}`,
        }}
      />
      {/* glowing cap */}
      <div
        style={{
          position: "absolute",
          left: 1080 / 2 - PILLAR_WIDTH / 2 - 10,
          top: top - 8,
          width: PILLAR_WIDTH + 20,
          height: 16,
          borderRadius: 999,
          background: color,
          opacity: glowPulse * grow,
          filter: "blur(10px)",
        }}
      />
      {/* baseline */}
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: BASELINE_Y,
          height: 2,
          background: `${color}33`,
        }}
      />
    </>
  );
};
