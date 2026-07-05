import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";

type Particle = {
  x: number; // % across
  y: number; // % down
  size: number;
  opacity: number;
  driftSpeed: number;
  driftRange: number;
  phase: number;
};

// Deterministic pseudo-random so every render is identical (no flicker between renders)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

const PARTICLE_COUNT = 16;

export const Bokeh: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const particles: Particle[] = useMemo(() => {
    return new Array(PARTICLE_COUNT).fill(0).map((_, i) => ({
      x: seededRandom(i + 1) * 100,
      y: seededRandom(i + 50) * 100,
      size: 4 + seededRandom(i + 100) * 14,
      opacity: 0.06 + seededRandom(i + 150) * 0.16,
      driftSpeed: 0.5 + seededRandom(i + 200) * 1.2,
      driftRange: 20 + seededRandom(i + 250) * 40,
      phase: seededRandom(i + 300) * Math.PI * 2,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {particles.map((p, i) => {
        const t = (frame / durationInFrames) * Math.PI * 2 * p.driftSpeed + p.phase;
        const yOffset = Math.sin(t) * p.driftRange * 0.15;
        const xOffset = Math.cos(t * 0.7) * p.driftRange * 0.08;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + xOffset}%`,
              top: `${p.y + yOffset}%`,
              width: p.size,
              height: p.size,
              borderRadius: 999,
              background: theme.colors.goldLight,
              opacity: p.opacity,
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const RadialGlowBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 30%, ${theme.colors.bgDark2} 0%, ${theme.colors.bgDark} 65%)`,
      }}
    />
  );
};
