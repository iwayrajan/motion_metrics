import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { DonutChartContent } from "../../content/types";
import { SEGMENT_DRAW_DURATION, TEXT_COLOR, MUTED_COLOR, colorForIndex } from "./config";

const LEGEND_TOP = 1020;
const ROW_HEIGHT = 56;

export const Legend: React.FC<{ content: DonutChartContent }> = ({ content }) => {
  const totalShare = content.segments.reduce((sum, s) => sum + s.share, 0) || 1;

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: LEGEND_TOP, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {content.segments.map((seg, i) => (
        <LegendRow
          key={i}
          name={seg.name}
          pct={(seg.share / totalShare) * 100}
          color={seg.color || colorForIndex(i)}
          revealFrame={(i + 1) * SEGMENT_DRAW_DURATION}
        />
      ))}
    </div>
  );
};

const LegendRow: React.FC<{ name: string; pct: number; color: string; revealFrame: number }> = ({
  name,
  pct,
  color,
  revealFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(frame - revealFrame, 0);
  const bounce = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 140 } });
  const translateY = interpolate(bounce, [0, 1], [16, 0]);
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        height: ROW_HEIGHT,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: 999, background: color, boxShadow: `0 0 10px ${color}` }} />
      <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 24, color: TEXT_COLOR, minWidth: 220 }}>{name}</div>
      <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 24, color: MUTED_COLOR }}>{Math.round(pct)}%</div>
    </div>
  );
};
