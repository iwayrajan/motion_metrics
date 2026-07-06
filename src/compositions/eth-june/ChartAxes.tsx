import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CHART_LEFT, CHART_RIGHT, CHART_BOTTOM, pointY, TEXT_COLOR } from "./config";
import { ethJunePrices, MAX_PRICE } from "../../content/eth-june-data";

const Y_LABELS = [0, 1000, 2000, 3000];

export const ChartAxes: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {Y_LABELS.map((val) => {
        const y = pointY(val, MAX_PRICE);
        return (
          <React.Fragment key={val}>
            <div
              style={{
                position: "absolute",
                left: CHART_LEFT,
                width: CHART_RIGHT - CHART_LEFT,
                top: y,
                height: 1,
                background: "#ffffff0a",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                width: CHART_LEFT - 30,
                top: y - 9,
                textAlign: "right",
                fontFamily: "'Inter'",
                fontWeight: 600,
                fontSize: 20, // mobile min per mobile-vs-desktop.md
                color: "#8a7fae",
              }}
            >
              ${val / 1000}K
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: CHART_LEFT,
          width: CHART_RIGHT - CHART_LEFT,
          top: CHART_BOTTOM,
          height: 1,
          background: "#ffffff25",
        }}
      />

      {ethJunePrices.map((p, i) => (
        <div
          key={p.year}
          style={{
            position: "absolute",
            left: CHART_LEFT + (i / (ethJunePrices.length - 1)) * (CHART_RIGHT - CHART_LEFT) - 40,
            width: 80,
            top: CHART_BOTTOM + 16,
            textAlign: "center",
            fontFamily: "'Inter'",
            fontWeight: 700,
            fontSize: 22, // mobile min
            color: TEXT_COLOR,
          }}
        >
          {p.year}
        </div>
      ))}
    </div>
  );
};
