import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { btcJunePrices, MAX_PRICE } from "../../content/btc-june-data";
import { pointX, pointY } from "./config";

export const PriceCallout: React.FC<{
  index: number;
  label: string;
  color: string;
}> = ({ index, label, color }) => {
  const frame = useCurrentFrame();
  const p = btcJunePrices[index];
  const x = pointX(index, btcJunePrices.length);
  const y = pointY(p.price, MAX_PRICE);

  const loopFrame = frame % 40;
  const glowOpacity = interpolate(loopFrame, [0, 20, 40], [0, 0.5, 0]);

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [0, 15], [12, 0], { extrapolateRight: "clamp" });

  // alternate label above/below to avoid colliding with the value label already there
  const labelTop = y + 40;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 26,
          top: y - 26,
          width: 52,
          height: 52,
          borderRadius: 999,
          background: color,
          opacity: glowOpacity,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 150,
          width: 300,
          top: labelTop,
          textAlign: "center",
          fontFamily: "'Inter'",
          fontWeight: 600,
          fontSize: 22,
          color,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
    </>
  );
};
