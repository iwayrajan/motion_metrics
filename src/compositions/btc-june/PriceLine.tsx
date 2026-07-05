import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { btcJunePrices, MAX_PRICE } from "../../content/btc-june-data";
import { pointX, pointY, LINE_COLOR, DRAW_DURATION } from "./config";

const points = btcJunePrices.map((p, i) => ({
  x: pointX(i, btcJunePrices.length),
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

const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

export const PriceLine: React.FC = () => {
  const frame = useCurrentFrame();
  const drawProgress = interpolate(frame, [0, DRAW_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const drawnLength = totalLength * drawProgress;

  return (
    <>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={pathD}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - drawnLength}
        />
      </svg>

      {points.map((p, i) => {
        // the line reaches point i once cumulative length up to it has been drawn
        const lengthAtPoint = i === 0 ? 0 : cumulativeLengths[i - 1];
        const revealed = drawnLength >= lengthAtPoint - 2;
        if (!revealed) return null;

        const localFrame = frame - 1; // dots pop right as line arrives — simple fade/scale
        const opacity = interpolate(localFrame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: p.x - 9,
                top: p.y - 9,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: LINE_COLOR,
                border: "3px solid #fff",
                opacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: p.x - 90,
                width: 180,
                top: p.y - 52,
                textAlign: "center",
                fontFamily: "'Inter'",
                fontWeight: 700,
                fontSize: 24,
                color: "#ffffff",
                opacity,
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
