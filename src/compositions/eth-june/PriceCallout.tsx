import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ethJunePrices, MAX_PRICE } from "../../content/eth-june-data";
import { pointX, pointY, WIDTH } from "./config";

const LABEL_WIDTH = 320;
const CANVAS_MARGIN = 24; // per references/pitfalls.md #3 — clamp so edge points don't clip

export const PriceCallout: React.FC<{ index: number; label: string; color: string }> = ({
  index,
  label,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ethJunePrices[index];
  const x = pointX(index, ethJunePrices.length);
  const y = pointY(p.price, MAX_PRICE);

  const loopFrame = frame % 36;
  const glowOpacity = interpolate(loopFrame, [0, 18, 36], [0, 0.6, 0]);

  // punch-in bounce, mobile-profile default (springs.bounceIn: damping 60, stiffness 120)
  const bounce = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const scale = interpolate(bounce, [0, 1], [0.5, 1]);
  const labelOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const labelTop = y + 46;
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
          top: labelTop,
          textAlign: "center",
          fontFamily: "'Inter'",
          fontWeight: 700,
          fontSize: 24, // mobile min
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
