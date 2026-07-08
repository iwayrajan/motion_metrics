import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

const DIGIT_HEIGHT = 96;
const SPINS = 2; // how many full 0-9 rotations before landing, for a satisfying "spin"

const Digit: React.FC<{ value: number; delay: number; color: string }> = ({ value, delay, color }) => {
  const frame = useCurrentFrame();
  const local = Math.max(frame - delay, 0);
  const progress = interpolate(local, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const targetSteps = SPINS * 10 + value;
  const translateY = -progress * targetSteps * DIGIT_HEIGHT;

  const strip = Array.from({ length: SPINS * 10 + 10 }, (_, i) => i % 10);

  return (
    <div style={{ height: DIGIT_HEIGHT, overflow: "hidden", width: 56 }}>
      <div style={{ transform: `translateY(${translateY}px)` }}>
        {strip.map((d, i) => (
          <div
            key={i}
            style={{
              height: DIGIT_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Inter'",
              fontWeight: 800,
              fontSize: 80,
              color,
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

// Displays a formatted price string (e.g. "$1,569") as a hero odometer — digits roll,
// symbols (currency sign, commas) fade in statically alongside them.
export const HeroOdometer: React.FC<{ text: string; color: string; staggerPerDigit?: number }> = ({
  text,
  color,
  staggerPerDigit = 3,
}) => {
  const frame = useCurrentFrame();
  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  let digitIndex = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", opacity: containerOpacity }}>
      {text.split("").map((char, i) => {
        if (/[0-9]/.test(char)) {
          const delay = digitIndex * staggerPerDigit;
          digitIndex += 1;
          return <Digit key={i} value={parseInt(char, 10)} delay={delay} color={color} />;
        }
        return (
          <div
            key={i}
            style={{
              fontFamily: "'Inter'",
              fontWeight: 800,
              fontSize: 80,
              color,
              width: char === "," ? 20 : 40,
              textAlign: "center",
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};
