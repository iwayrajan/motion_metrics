import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BG_DARK, BG_GLOW, ACCENT_PINK, LINE_COLOR } from "./config";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

// Mobile profile: "layer motion, don't single-task it" — this keeps something moving
// in the background at all times so the video never reads as frozen.
export const AmbientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 90, [0, 45, 90], [0.5, 0.8, 0.5]);

  const particles = useMemo(
    () =>
      new Array(14).fill(0).map((_, i) => ({
        x: seededRandom(i + 1) * 100,
        yStart: seededRandom(i + 40) * 100,
        size: 2 + seededRandom(i + 80) * 5,
        speed: 0.08 + seededRandom(i + 120) * 0.18,
        color: i % 2 === 0 ? LINE_COLOR : ACCENT_PINK,
      })),
    []
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% ${20 + pulse * 5}%, ${BG_GLOW} 0%, ${BG_DARK} 70%)`,
        }}
      />
      {particles.map((p, i) => {
        const y = p.yStart - frame * p.speed;
        const wrappedY = ((y % 100) + 100) % 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${wrappedY}%`,
              width: p.size,
              height: p.size,
              borderRadius: 999,
              background: p.color,
              opacity: 0.35,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
