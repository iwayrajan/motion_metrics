import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CHART_LEFT, CHART_RIGHT, CHART_TOP, CHART_BOTTOM, pointX, pointY } from "./config";
import { btcJunePrices, MAX_PRICE } from "../../content/btc-june-data";

const Y_LABELS = [0, 25000, 50000, 75000, 100000];

export const ChartAxes: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

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
                background: "#ffffff08",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                width: CHART_LEFT - 30,
                top: y - 7,
                textAlign: "right",
                fontFamily: "'Inter'",
                fontSize: 15,
                color: "#666",
              }}
            >
              ${val / 1000}K
            </div>
          </React.Fragment>
        );
      })}

      {/* baseline */}
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

      {/* year labels */}
      {btcJunePrices.map((p, i) => (
        <div
          key={p.year}
          style={{
            position: "absolute",
            left: pointX(i, btcJunePrices.length) - 40,
            width: 80,
            top: CHART_BOTTOM + 16,
            textAlign: "center",
            fontFamily: "'Inter'",
            fontWeight: 500,
            fontSize: 17,
            color: "#aaa",
          }}
        >
          {p.year}
        </div>
      ))}
    </div>
  );
};
