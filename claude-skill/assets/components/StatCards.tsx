// Copy into src/components/StatCards.tsx.
// Standard "2-3 insight cards slide up staggered" beat used by every chart type.

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export type StatCardData = { eyebrow: string; value: string; borderColor: string };

const Card: React.FC<{ data: StatCardData; index: number; stagger: number; fontFamily: string }> = ({
  data,
  index,
  stagger,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - index * stagger;
  const enter = spring({ frame: Math.max(local, 0), fps, config: { damping: 16 }, durationInFrames: 20 });
  const translateY = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: 380,
        background: "#111122",
        borderLeft: `3px solid ${data.borderColor}`,
        borderRadius: 4,
        padding: "18px 22px",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div style={{ fontFamily, fontWeight: 500, fontSize: 13, color: "#9ca3af" }}>{data.eyebrow}</div>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 18, color: "#ffffff", marginTop: 6 }}>
        {data.value}
      </div>
    </div>
  );
};

export const StatCards: React.FC<{
  cards: StatCardData[];
  stagger?: number; // frames between each card, default 15 (0.5s)
  fontFamily?: string;
  bottom?: number;
}> = ({ cards, stagger = 15, fontFamily = "'Inter'", bottom = 40 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom, display: "flex", justifyContent: "center", gap: 24 }}>
    {cards.map((c, i) => (
      <Card key={i} data={c} index={i} stagger={stagger} fontFamily={fontFamily} />
    ))}
  </div>
);
