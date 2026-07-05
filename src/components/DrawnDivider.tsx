import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";

export const DrawnDivider: React.FC<{
  width?: number;
  delay?: number;
  duration?: number;
}> = ({ width = 140, delay = 0, duration = 20 }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - delay);
  const progress = interpolate(local, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`}>
      <line
        x1={width / 2 - (width / 2) * progress}
        y1="6"
        x2={width / 2 + (width / 2) * progress}
        y2="6"
        stroke={theme.colors.gold}
        strokeWidth="1.5"
      />
      <circle cx={width / 2} cy="6" r={2.5 * progress} fill={theme.colors.goldLight} />
    </svg>
  );
};

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 4,
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${theme.colors.gold}, ${theme.colors.goldLight})`,
      }}
    />
  );
};
