import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame } from "remotion";
import { AmbientBackground } from "./ai-countdown/AmbientBackground";
import { TitleCard } from "./ai-countdown/TitleCard";
import { CompanySlide } from "./ai-countdown/CompanySlide";
import { SourceLine } from "../components/FinalHold";
import { aiCompanies } from "../content/ai-companies-data";
import {
  DURATION,
  TITLE_DURATION,
  PER_COMPANY_DURATION,
  OUTRO_DURATION,
  TEXT_COLOR,
} from "./ai-countdown/config";

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20, DURATION - 30, DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Audio src={staticFile("audio/synthwave-laser-drift-251660.mp3")} volume={0.4 * fade} />;
};

// Countdown order: #10 (smallest) first, building up to #1 (largest) last — standard
// countdown convention, and matches the biggest reveal landing at the end.
const countdownOrder = [...aiCompanies].sort((a, b) => b.rank - a.rank);

export const AICompanyCountdown: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05040a" }}>
      <MusicBed />
      <AmbientBackground />

      <Sequence durationInFrames={TITLE_DURATION}>
        <TitleCard durationInFrames={TITLE_DURATION} />
      </Sequence>

      {countdownOrder.map((company, i) => (
        <Sequence
          key={company.name}
          from={TITLE_DURATION + i * PER_COMPANY_DURATION}
          durationInFrames={PER_COMPANY_DURATION}
        >
          <CompanySlide company={company} />
        </Sequence>
      ))}

      {/* closing hold — starts exactly when the last company's Sequence ends, no dead gap.
          Last company's slide already ends with its own fade-out per CompanySlide's opacity
          envelope, so no separate "unmount chart" risk here (see references/pitfalls.md #2). */}
      <Sequence from={TITLE_DURATION + countdownOrder.length * PER_COMPANY_DURATION} durationInFrames={OUTRO_DURATION}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 34, color: TEXT_COLOR, textAlign: "center", padding: "0 60px" }}>
            Which one hits $1T first?
          </div>
        </AbsoluteFill>
        <SourceLine text="aifundingtracker.com, June 2026 · valuations from private rounds/IPO targets, not audited financials" />
      </Sequence>
    </AbsoluteFill>
  );
};
