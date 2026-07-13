import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ERA_WINDOW, TRANSITION_FRAC } from "./config";
import { BarChartRaceContent } from "../../content/types";

export const EraWatermark: React.FC<{ content: BarChartRaceContent }> = ({ content }) => {
  const frame = useCurrentFrame();
  const eraIndex = Math.min(Math.floor(frame / ERA_WINDOW), content.eras.length - 1);
  const localFrame = frame - eraIndex * ERA_WINDOW;
  const transitionWindow = ERA_WINDOW * TRANSITION_FRAC;

  // crossfade: previous era's label fades out over the first half of the transition,
  // current era's label fades in over the second half
  const outOpacity = interpolate(localFrame, [0, transitionWindow / 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inOpacity = interpolate(localFrame, [transitionWindow / 2, transitionWindow], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showPrev = eraIndex > 0 && localFrame < transitionWindow;

  return (
    <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center" }}>
      {showPrev ? (
        <div style={{ position: "absolute", inset: 0, fontFamily: "'Inter'", fontWeight: 800, fontSize: 130, color: "#ffffff12", opacity: outOpacity }}>
          {content.eras[eraIndex - 1].label}
        </div>
      ) : null}
      <div style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 130, color: "#ffffff12", opacity: eraIndex === 0 ? 1 : inOpacity }}>
        {content.eras[eraIndex].label}
      </div>
    </div>
  );
};
