import React from "react";
import { theme } from "../theme";

// A simple, generic ornamental corner flourish (procedurally drawn line art,
// in the spirit of Indian wedding-invite motifs) — not a copy of any existing artwork.
export const CornerOrnament: React.FC<{
  corner: "top-left" | "bottom-right";
  opacity?: number;
}> = ({ corner, opacity = 0.5 }) => {
  const isTopLeft = corner === "top-left";

  const transformStyle = isTopLeft
    ? {}
    : { transform: "rotate(180deg)", right: 0, bottom: 0, left: "auto", top: "auto" };

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      style={{
        position: "absolute",
        top: isTopLeft ? 0 : "auto",
        left: isTopLeft ? 0 : "auto",
        ...transformStyle,
        opacity,
      }}
    >
      <g stroke={theme.colors.gold} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M10 60 Q10 10 60 10" />
        <path d="M10 90 Q10 30 90 30" opacity="0.6" />
        <circle cx="60" cy="10" r="4" fill={theme.colors.gold} stroke="none" />
        <circle cx="10" cy="60" r="4" fill={theme.colors.gold} stroke="none" />
        <path d="M30 45 Q45 45 45 30" opacity="0.8" />
      </g>
    </svg>
  );
};
