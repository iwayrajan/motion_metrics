import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";
import { BASELINE_Y, MAX_BAR_HEIGHT, BAR_WIDTH, barX } from "./config";

// India is always index 0 (rank 1)
export const IndiaHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const x = barX(0);
  const top = BASELINE_Y - MAX_BAR_HEIGHT;

  // glow pulse: opacity 0 -> 0.3 -> 0, looping every 1.5s (45 frames)
  const loopFrame = frame % 45;
  const glowOpacity = interpolate(loopFrame, [0, 22, 45], [0, 0.3, 0]);

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [0, 15], [10, 0], { extrapolateRight: "clamp" });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 12,
          top: top - 12,
          width: BAR_WIDTH + 24,
          height: MAX_BAR_HEIGHT + 24,
          borderRadius: 10,
          background: "#ffffff",
          opacity: glowOpacity,
          filter: "blur(18px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 60,
          width: BAR_WIDTH + 120,
          top: top - 64,
          textAlign: "center",
          fontFamily: fontFamilies.data,
          fontWeight: 600,
          fontSize: 13,
          color: "#FF9933",
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        Surpassed China in 2023
      </div>
    </>
  );
};

export const ReferenceLine: React.FC<{ valueLabel: string; y: number }> = ({ valueLabel, y }) => {
  const frame = useCurrentFrame();
  // dashed line "draws" across left to right
  const progress = interpolate(frame, [0, 25], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", left: 90, top: y, right: 50, height: 1 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 1,
          width: `${progress}%`,
          backgroundImage: "linear-gradient(to right, #ffffff15 50%, transparent 50%)",
          backgroundSize: "10px 1px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -18,
          fontFamily: fontFamilies.data,
          fontSize: 12,
          color: "#666",
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {valueLabel}
      </div>
    </div>
  );
};
