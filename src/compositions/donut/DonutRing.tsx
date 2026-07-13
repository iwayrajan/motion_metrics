import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { DonutChartContent } from "../../content/types";
import {
  CX,
  CY,
  RADIUS,
  STROKE_WIDTH,
  CIRCUMFERENCE,
  GAP_DEGREES,
  SEGMENT_DRAW_DURATION,
  HOLD_BUFFER,
  TEXT_COLOR,
  MUTED_COLOR,
  colorForIndex,
} from "./config";

export const DonutRing: React.FC<{ content: DonutChartContent }> = ({ content }) => {
  const frame = useCurrentFrame();
  const totalShare = content.segments.reduce((sum, s) => sum + s.share, 0) || 1;
  const gapLen = (GAP_DEGREES / 360) * CIRCUMFERENCE;

  let cumulativeShare = 0;
  const segmentsWithGeometry = content.segments.map((seg, i) => {
    const shareBefore = cumulativeShare;
    cumulativeShare += seg.share;
    const fraction = seg.share / totalShare;
    const startAngleDeg = -90 + (shareBefore / totalShare) * 360;
    const fullArcLen = fraction * CIRCUMFERENCE;
    const arcLen = Math.max(fullArcLen - gapLen, 0);

    // No nested <Sequence> here — Remotion's Sequence wraps children in a div by
    // default, which can't validly nest inside <svg>. Compute each segment's own
    // reveal progress arithmetically from the shared parent frame instead (same
    // pattern used for PriceLine's per-point reveal timing).
    const localFrame = Math.max(frame - i * SEGMENT_DRAW_DURATION, 0);
    const revealProgress = interpolate(localFrame, [0, SEGMENT_DRAW_DURATION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const revealedLen = arcLen * revealProgress;

    return {
      ...seg,
      color: seg.color || colorForIndex(i),
      startAngleDeg,
      revealedLen,
      isRevealing: localFrame > 0 && localFrame < SEGMENT_DRAW_DURATION,
    };
  });

  // running total % shown at center while drawing; freezes once fully drawn
  const totalDrawFrames = content.segments.length * SEGMENT_DRAW_DURATION;
  const drawFrame = Math.min(frame, totalDrawFrames);
  const revealedShareSum = segmentsWithGeometry.reduce((sum, s, i) => {
    const localFrame = Math.max(drawFrame - i * SEGMENT_DRAW_DURATION, 0);
    const progress = interpolate(localFrame, [0, SEGMENT_DRAW_DURATION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return sum + (content.segments[i].share / totalShare) * 100 * progress;
  }, 0);

  const fullyDrawn = frame >= totalDrawFrames + HOLD_BUFFER;
  const closingFrame = Math.max(frame - (totalDrawFrames + HOLD_BUFFER), 0);
  const centerCrossfade = interpolate(closingFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // slow rotation of the whole ring during the closing beat
  const closingRotation = fullyDrawn ? interpolate(closingFrame, [0, 300], [0, 30]) : 0;

  // glow pulse on the largest segment once fully drawn
  const largestIndex = segmentsWithGeometry.reduce(
    (maxI, s, i, arr) => (s.share > arr[maxI].share ? i : maxI),
    0
  );

  return (
    <>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, transform: `rotate(${closingRotation}deg)`, transformOrigin: `${CX}px ${CY}px` }}
      >
        {/* base track */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#ffffff10" strokeWidth={STROKE_WIDTH} />

        {segmentsWithGeometry.map((seg, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE - seg.revealedLen}
            transform={`rotate(${seg.startAngleDeg} ${CX} ${CY})`}
            style={{
              filter: fullyDrawn && i === largestIndex ? `drop-shadow(0 0 14px ${seg.color})` : undefined,
            }}
          />
        ))}
      </svg>

      {/* center text — counter-rotate against the ring's closing rotation so it stays upright */}
      <div
        style={{
          position: "absolute",
          left: CX - 200,
          top: CY - 50,
          width: 400,
          textAlign: "center",
          transform: `rotate(${-closingRotation}deg)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: fullyDrawn ? 1 - centerCrossfade : 1 }}>
          <div style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 56, color: TEXT_COLOR }}>
            {Math.round(revealedShareSum)}%
          </div>
          {content.centerLabel ? (
            <div style={{ fontFamily: "'Inter'", fontWeight: 500, fontSize: 20, color: MUTED_COLOR, marginTop: 4 }}>
              {content.centerLabel}
            </div>
          ) : null}
        </div>
        {content.closingStat ? (
          <div style={{ position: "absolute", inset: 0, opacity: fullyDrawn ? centerCrossfade : 0 }}>
            <div style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 40, color: TEXT_COLOR, padding: "0 12px" }}>
              {content.closingStat}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
