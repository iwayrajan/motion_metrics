import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";

const FLAG_COLORS = ["#FF9933", "#DE2910", "#0A3161", "#FFDE00", "#01411C", "#008751", "#009739", "#F42A41", "#0039A6", "#EA0437"];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

export const DriftParticles: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = useMemo(
    () =>
      new Array(9).fill(0).map((_, i) => ({
        x: seededRandom(i + 1) * 90 + 5,
        yStart: seededRandom(i + 40) * 100,
        size: 3 + seededRandom(i + 80) * 6,
        speed: 0.15 + seededRandom(i + 120) * 0.25,
        color: FLAG_COLORS[i % FLAG_COLORS.length],
      })),
    []
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

export const SourceLine: React.FC = () => {
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
        fontFamily: fontFamilies.data,
        fontSize: 11,
        color: "#444",
        opacity,
      }}
    >
      UN World Population Prospects · 2026 · population in millions
    </div>
  );
};
