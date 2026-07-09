import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CHART_LEFT, CHART_RIGHT, CHART_BOTTOM, pointX, pointY, getYAxisLabels, MUTED_COLOR, TEXT_COLOR } from "./config";
import { PriceChartContent } from "../../content/types";

export const ChartAxes: React.FC<{ content: PriceChartContent; maxValue: number }> = ({
  content,
  maxValue,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const prefix = content.unitPrefix ?? "";
  const yLabels = getYAxisLabels(maxValue);

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {yLabels.map((val) => {
        const y = pointY(val, maxValue);
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
                top: y - 9,
                textAlign: "right",
                fontFamily: "'Inter'",
                fontWeight: 600,
                fontSize: 18,
                color: MUTED_COLOR,
              }}
            >
              {prefix}
              {val >= 1000 ? `${Math.round(val / 1000)}K` : val}
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
          height: 2,
          background: "#ffffff25",
        }}
      />

      {content.points.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pointX(i, content.points.length) - 40,
            width: 80,
            top: CHART_BOTTOM + 16,
            textAlign: "center",
            fontFamily: "'Inter'",
            fontWeight: 700,
            fontSize: 20,
            color: TEXT_COLOR,
          }}
        >
          {p.label}
        </div>
      ))}
    </div>
  );
};
