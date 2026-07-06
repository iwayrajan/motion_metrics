import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Easing } from "remotion";
import { ethJunePrices, MAX_PRICE } from "../../content/eth-june-data";
import { pointX, pointY, LINE_COLOR, DRAW_DURATION, CHART_BOTTOM, TEXT_COLOR } from "./config";

const points = ethJunePrices.map((p, i) => ({
  x: pointX(i, ethJunePrices.length),
  y: pointY(p.price, MAX_PRICE),
  price: p.price,
}));

const segmentLengths = points.slice(1).map((p, i) => {
  const prev = points[i];
  return Math.hypot(p.x - prev.x, p.y - prev.y);
});
const totalLength = segmentLengths.reduce((a, b) => a + b, 0);
const cumulativeLengths = segmentLengths.reduce<number[]>((acc, len) => {
  acc.push((acc[acc.length - 1] ?? 0) + len);
  return acc;
}, []);

const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
// area wake: line path + drop to baseline + close back to start, for the gradient fill under the line
const areaD = `${lineD} L ${points[points.length - 1].x} ${CHART_BOTTOM} L ${points[0].x} ${CHART_BOTTOM} Z`;

export const PriceLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawProgress = interpolate(frame, [0, DRAW_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const drawnLength = totalLength * drawProgress;

  // area wake trails ~5 frames behind the line tip, per animation-techniques.md #2
  const areaFrame = Math.max(frame - 5, 0);
  const areaProgress = interpolate(areaFrame, [0, DRAW_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="areaWake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LINE_COLOR} stopOpacity="0.35" />
            <stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaD}
          fill="url(#areaWake)"
          opacity={areaProgress}
          style={{ clipPath: `inset(0 ${100 - areaProgress * 100}% 0 0)` }}
        />
        <path
          d={lineD}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - drawnLength}
          style={{ filter: `drop-shadow(0 0 8px ${LINE_COLOR})` }}
        />
      </svg>

      {points.map((p, i) => {
        const lengthAtPoint = i === 0 ? 0 : cumulativeLengths[i - 1];
        const revealed = drawnLength >= lengthAtPoint - 2;
        if (!revealed) return null;

        // Approximate the frame this point was first revealed (linear approximation of the
        // eased draw curve is close enough for triggering an entrance animation, vs. exact
        // data timing which doesn't need to be frame-perfect here).
        const revealFrame = (lengthAtPoint / totalLength) * DRAW_DURATION;
        const localFrame = Math.max(frame - revealFrame, 0);

        // bouncy punch-in per mobile-vs-desktop.md — springs.bounceIn preset inlined
        const bounce = spring({ frame: localFrame, fps, config: { damping: 10, mass: 0.5 } });
        const scale = interpolate(bounce, [0, 1], [0.4, 1]);
        const opacity = interpolate(localFrame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: p.x - 11,
                top: p.y - 11,
                width: 22,
                height: 22,
                borderRadius: 999,
                background: LINE_COLOR,
                border: "3px solid #fff",
                opacity,
                transform: `scale(${scale})`,
                boxShadow: `0 0 16px ${LINE_COLOR}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: p.x - 100,
                width: 200,
                top: p.y - 58,
                textAlign: "center",
                fontFamily: "'Inter'",
                fontWeight: 800,
                fontSize: 28, // mobile min
                color: TEXT_COLOR,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              ${Math.round(p.price).toLocaleString("en-US")}
            </div>
          </div>
        );
      })}
    </>
  );
};
