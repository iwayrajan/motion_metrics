import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fontFamilies } from "../../fonts";
import {
  BASELINE_Y,
  MAX_BAR_HEIGHT,
  CHART_LEFT_MARGIN,
  CHART_RIGHT_MARGIN,
} from "./config";
import { MAX_POPULATION } from "../../content/population-data";

const CHART_RIGHT_X = 1920 - CHART_RIGHT_MARGIN;
const Y_LABELS = [0, 250, 500, 750, 1000, 1500];

export const ChartAxis: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* baseline */}
      <div
        style={{
          position: "absolute",
          left: CHART_LEFT_MARGIN,
          right: CHART_RIGHT_MARGIN,
          top: BASELINE_Y,
          height: 1,
          background: "#ffffff25",
        }}
      />

      {Y_LABELS.map((val) => {
        const y = BASELINE_Y - (val / MAX_POPULATION) * MAX_BAR_HEIGHT;
        if (val === 0) return null; // baseline already drawn
        return (
          <React.Fragment key={val}>
            <div
              style={{
                position: "absolute",
                left: CHART_LEFT_MARGIN,
                right: CHART_RIGHT_MARGIN,
                top: y,
                height: 1,
                background: "#ffffff06",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                width: CHART_LEFT_MARGIN - 10,
                top: y - 7,
                textAlign: "right",
                fontFamily: fontFamilies.data,
                fontSize: 11,
                color: "#555",
              }}
            >
              {val >= 1000 ? `${val.toLocaleString("en-US")}M` : `${val}M`}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
