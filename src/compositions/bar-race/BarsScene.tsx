import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { BarChartRaceContent } from "../../content/types";
import {
  CHART_TOP,
  CHART_LEFT,
  CHART_RIGHT,
  ROW_HEIGHT,
  BAR_HEIGHT,
  ERA_WINDOW,
  TRANSITION_FRAC,
  TEXT_COLOR,
  MUTED_COLOR,
  colorForIndex,
  getRoster,
  getGlobalMax,
  rankOf,
  valueOf,
} from "./config";

export const BarsScene: React.FC<{ content: BarChartRaceContent }> = ({ content }) => {
  const frame = useCurrentFrame();
  const roster = getRoster(content);
  const globalMax = getGlobalMax(content);
  const maxBarWidth = CHART_RIGHT - CHART_LEFT - 220; // leave room for the value label past the bar end

  const eraIndex = Math.min(Math.floor(frame / ERA_WINDOW), content.eras.length - 1);
  const localFrame = frame - eraIndex * ERA_WINDOW;
  const transitionWindow = ERA_WINDOW * TRANSITION_FRAC;
  const transitionProgress = interpolate(localFrame, [0, transitionWindow], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const currEra = content.eras[eraIndex];
  const prevEra = eraIndex > 0 ? content.eras[eraIndex - 1] : null;

  return (
    <>
      {roster.map((name, rosterI) => {
        const currValue = valueOf(currEra.values, name);
        const currRank = rankOf(currEra.values, name);

        // era 0 has no "previous" — bars grow in from 0 at their final (era-0) rank
        const prevValue = prevEra ? valueOf(prevEra.values, name) : 0;
        const prevRank = prevEra ? rankOf(prevEra.values, name) : currRank;

        const value = interpolate(transitionProgress, [0, 1], [prevValue, currValue]);
        const rank = interpolate(transitionProgress, [0, 1], [prevRank, currRank]);

        const y = CHART_TOP + rank * ROW_HEIGHT;
        const barWidth = Math.max((value / globalMax) * maxBarWidth, 2);
        const color = colorForIndex(rosterI);

        return (
          <div key={name} style={{ position: "absolute", left: CHART_LEFT, top: y, width: CHART_RIGHT - CHART_LEFT, height: BAR_HEIGHT }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: barWidth,
                height: BAR_HEIGHT,
                borderRadius: "0 10px 10px 0",
                background: `linear-gradient(90deg, ${color}cc 0%, ${color} 100%)`,
                boxShadow: `0 0 20px ${color}55`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 0,
                height: BAR_HEIGHT,
                display: "flex",
                alignItems: "center",
                fontFamily: "'Inter'",
                fontWeight: 700,
                fontSize: 26,
                color: "#0a0410",
                maxWidth: Math.max(barWidth - 32, 0),
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {barWidth > 140 ? name : ""}
            </div>
            <div
              style={{
                position: "absolute",
                left: barWidth + 12,
                top: 0,
                height: BAR_HEIGHT,
                display: "flex",
                alignItems: "center",
                fontFamily: "'Inter'",
                fontWeight: 800,
                fontSize: 26,
                color: TEXT_COLOR,
                whiteSpace: "nowrap",
              }}
            >
              {barWidth <= 140 ? `${name} · ` : ""}
              {content.unitPrefix ?? ""}
              {Math.round(value).toLocaleString("en-US")}
            </div>
          </div>
        );
      })}
    </>
  );
};
