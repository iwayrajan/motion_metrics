import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PriceChartContent } from "../../content/types";
import { pointX, pointY, WIDTH, CANVAS_MARGIN } from "./config";

const LABEL_WIDTH = 320;

export const PriceCallout: React.FC<{
  content: PriceChartContent;
  maxValue: number;
  pointIndex: number;
  label: string;
  color: string;
}> = ({ content, maxValue, pointIndex, label, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const point = content.points[pointIndex];
  if (!point) return null;

  const x = pointX(pointIndex, content.points.length);
  const y = pointY(point.value, maxValue);

  const loopFrame = frame % 36;
  const glowOpacity = interpolate(loopFrame, [0, 18, 36], [0, 0.6, 0]);

  const bounce = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const scale = interpolate(bounce, [0, 1], [0.5, 1]);
  const labelOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // edge clamp — per references/pitfalls.md #3, never center blindly on x
  const rawLeft = x - LABEL_WIDTH / 2;
  const clampedLeft = Math.max(CANVAS_MARGIN, Math.min(rawLeft, WIDTH - LABEL_WIDTH - CANVAS_MARGIN));

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 30,
          top: y - 30,
          width: 60,
          height: 60,
          borderRadius: 999,
          background: color,
          opacity: glowOpacity,
          filter: "blur(12px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: clampedLeft,
          width: LABEL_WIDTH,
          top: y + 46,
          textAlign: "center",
          fontFamily: "'Inter'",
          fontWeight: 700,
          fontSize: 22,
          color,
          opacity: labelOpacity,
          transform: `scale(${scale})`,
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
    </>
  );
};
