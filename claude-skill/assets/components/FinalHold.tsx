// Copy into src/components/FinalHold.tsx.
// Standard closing beat: source citation + subtle ambient particle drift.

import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

export const SourceLine: React.FC<{ text: string; fontFamily?: string }> = ({
  text,
  fontFamily = "'Inter'",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily,
        fontSize: 11,
        color: "#444",
        opacity,
      }}
    >
      {text}
    </div>
  );
};

export const DriftParticles: React.FC<{ colors: string[]; count?: number }> = ({
  colors,
  count = 9,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: seededRandom(i + 1) * 90 + 5,
        yStart: seededRandom(i + 40) * 100,
        size: 3 + seededRandom(i + 80) * 6,
        speed: 0.15 + seededRandom(i + 120) * 0.25,
        color: colors[i % colors.length],
      })),
    [count, colors]
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
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
              opacity: 0.2,
            }}
          />
        );
      })}
    </div>
  );
};
