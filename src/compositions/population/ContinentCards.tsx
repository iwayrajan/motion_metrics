import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";
import { CARDS_STAGGER } from "./config";

type CardData = { eyebrow: string; value: string; borderColor: string };

const CARDS: CardData[] = [
  { eyebrow: "Asia dominates", value: "6 of the top 10", borderColor: "#FF9933" },
  { eyebrow: "Combined population", value: "4.63 Billion (56% of humanity)", borderColor: "#ffffff" },
  { eyebrow: "Fastest growing", value: "Nigeria: projected #3 by 2050", borderColor: "#008751" },
];

const Card: React.FC<{ data: CardData; index: number }> = ({ data, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - index * CARDS_STAGGER;
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
      <div style={{ fontFamily: fontFamilies.data, fontWeight: 500, fontSize: 13, color: "#9ca3af" }}>
        {data.eyebrow}
      </div>
      <div style={{ fontFamily: fontFamilies.data, fontWeight: 600, fontSize: 18, color: "#ffffff", marginTop: 6 }}>
        {data.value}
      </div>
    </div>
  );
};

export const ContinentCards: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 40,
        display: "flex",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {CARDS.map((c, i) => (
        <Card key={i} data={c} index={i} />
      ))}
    </div>
  );
};
